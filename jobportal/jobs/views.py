from rest_framework import generics, permissions
from django.db.models import Q
from .models import Job
from .serializers import JobSerializer
from .permissions import IsEmployer
from .models import SavedJob
from .serializers import SavedJobSerializer
from rest_framework.views import APIView
from rest_framework.generics import DestroyAPIView
from rest_framework.response import Response
from users.permissions import IsAdminUser
from users.models import Profile
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_queryset(self):
        user = self.request.user
        jobs = Job.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")
        location = self.request.query_params.get("location")
        job_type = self.request.query_params.get("job_type")
        salary = self.request.query_params.get("salary")

        # Role based jobs
        if user.role == "employer":
            jobs = jobs.filter(employer=user)

        elif user.role == "jobseeker":
            # jobs = jobs.filter(status="approved")  # use when admin exists
            jobs = jobs.all()

        elif user.role == "admin":
            jobs = jobs.all()    

        # Search filter
        if search:
            jobs = jobs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        # Location filter
        if location:
            jobs = jobs.filter(location__icontains=location)

        # Job type filter
        if job_type:
            jobs = jobs.filter(job_type=job_type)

        # Salary filter
        if salary:
            try:
                salary = float(salary)
                jobs = jobs.filter(salary__gte=salary)
            except ValueError:
                pass

        return jobs

    def perform_create(self, serializer):
        job = serializer.save(employer=self.request.user)

        channel_layer = get_channel_layer()

        # 🔥 Only jobseekers
        profiles = Profile.objects.select_related("user").filter(user__role="jobseeker")

        job_skills = (job.skills_required or "").lower()

        for profile in profiles:

            if not profile.skills:
                continue

            user_skills = [
                skill.strip().lower()
                for skill in profile.skills.split(",")
            ]

            # 🔥 Better matching
            matched = any(skill in job_skills for skill in user_skills)

            if matched:

                # ✅ Save notification
                Notification.objects.create(
                    user=profile.user,
                    message=f"New job for you: {job.title}",
                    job=job
                )

                # ✅ Send real-time notification
                async_to_sync(channel_layer.group_send)(
                    f"user_{profile.user.id}",
                    {
                        "type": "send_notification",
                        "message": f"New job: {job.title}"
                    }
                )

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsEmployer()]
        return [permissions.IsAuthenticated()]


from rest_framework.exceptions import ValidationError

class SaveJobView(generics.CreateAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        job = serializer.validated_data.get("job")

        if not job:
            raise ValidationError({"job": "This field is required"})

        user = self.request.user

        if SavedJob.objects.filter(user=user, job=job).exists():
            raise ValidationError({"detail": "Job already saved"})

        serializer.save(user=user)


class SavedJobsListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}
        

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

class AdminJobStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        job = Job.objects.get(pk=pk)
        status = request.data.get("status")

        if status not in ["approved", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)

        job.status = status
        job.save()

        return Response({"message": "Job updated"}) 

class AdminJobDeleteView(DestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]               