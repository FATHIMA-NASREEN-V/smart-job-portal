from django.db import IntegrityError
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsJobSeeker

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from notifications.models import Notification



# 🔹 Jobseeker Apply to Job
class ApplyToJobView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsJobSeeker]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"error": "You have already applied to this job."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        user = self.request.user

        if Application.objects.filter(job=job, applicant=user).exists():
            raise serializers.ValidationError("You already applied.")

        serializer.save(applicant=user)


# 🔹 Employer View Applicants (ONLY LIST, not create)
class EmployerApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            job__employer=self.request.user
        ).select_related("job", "applicant")


# 🔹 Employer Accept / Reject Applicant
class UpdateApplicationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):

        application = get_object_or_404(Application, pk=pk)

        # Only job owner can update
        if application.job.employer != request.user:
            return Response(
                {"error": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")

        if new_status not in ["accepted", "rejected"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = new_status
        application.save()

        # 🔔 Create Notification in DB
        message = f"Your application for '{application.job.title}' was {new_status}"

        Notification.objects.create(
            user=application.applicant,
            job=application.job,
            message=message
        )

        # 🔔 Send Realtime Notification
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user_{application.applicant.id}",
            {
                "type": "send_notification",
                "message": message
            }
        )

        return Response(
            {"message": "Application status updated successfully"}
        )
class JobseekerApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            applicant=self.request.user
        ).select_related("job")