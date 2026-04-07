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