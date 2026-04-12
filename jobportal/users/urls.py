from django.urls import path
from .views import (RegisterView,ProfileView,RegisterWithResumeView)
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import CustomTokenObtainPairView
from .views import AdminUserListView, ToggleUserStatusView, AdminStatsView
urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),
    path('register-with-resume/', RegisterWithResumeView.as_view(), name='register_with_resume'),
    path('login/',CustomTokenObtainPairView.as_view(),name='login'),
    path('refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('profile/',ProfileView.as_view(),name='profile'),
    path("admin/users/", AdminUserListView.as_view()),
    path("admin/users/<int:pk>/toggle/", ToggleUserStatusView.as_view()),
    path("admin/stats/", AdminStatsView.as_view()),
]