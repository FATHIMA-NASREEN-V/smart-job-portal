from django.urls import path
from .views import (RegisterView,ProfileView)
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),
    path('login/',CustomTokenObtainPairView.as_view(),name='login'),
    path('refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('profile/',ProfileView.as_view(),name='profile'),
    
]