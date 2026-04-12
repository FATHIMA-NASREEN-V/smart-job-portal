from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import Profile
from .serializers import ProfileSerializer
from .models import User
from rest_framework.generics import ListAPIView,DestroyAPIView,UpdateAPIView
from .permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from jobs.models import Job
from applications.models import Application

from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .resume_parser import extract_text_from_resume, parse_resume_with_claude
from .models import User, Profile
from django.contrib.auth.hashers import make_password

class RegisterWithResumeView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []   # public endpoint

    def post(self, request):
        username   = request.data.get("username")
        email      = request.data.get("email")
        password   = request.data.get("password")
        role       = request.data.get("role", "jobseeker")
        resume     = request.FILES.get("resume")

        # Basic validation
        if not all([username, email, password]):
            return Response(
                {"error": "username, email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role=role
        )

        # Parse resume if provided
        parsed = {}
        if resume:
            try:
                resume_text = extract_text_from_resume(resume)
                parsed = parse_resume_with_claude(resume_text)
            except Exception as e:
                print(f"Resume parsing failed: {e}")
                parsed = {}

        # Reset file pointer before saving
        if resume:
            resume.seek(0)

        # 👇 Use get_or_create to avoid duplicate profile error
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.job_title = parsed.get("job_title", "")
        profile.skills    = parsed.get("skills", "")
        profile.bio       = parsed.get("bio", "")
        if resume:
            profile.resume = resume
        profile.save()


        # Update user name if found
        if parsed.get("first_name"):
            user.first_name = parsed["first_name"]
        if parsed.get("last_name"):
            user.last_name = parsed["last_name"]
        user.save()

        return Response({
            "message": "Registered successfully",
            "parsed_profile": parsed
        }, status=status.HTTP_201_CREATED)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
 
class AdminUserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAdminUser]

class ToggleUserStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        user.is_active = not user.is_active
        user.save()
        return Response({"message": "User status updated"})    

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "users": User.objects.count(),
            "jobs": Job.objects.count(),
            "applications": Application.objects.count(),
            "pending_jobs": Job.objects.filter(status="pending").count(),
        })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    authentication_classes = []



class ProfileView(generics.RetrieveUpdateAPIView):

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Profile.objects.get(user=self.request.user)