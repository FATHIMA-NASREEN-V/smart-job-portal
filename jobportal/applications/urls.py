from django.urls import path
from .views import (ApplyToJobView,EmployerApplicationView,UpdateApplicationStatusView,JobseekerApplicationView)

urlpatterns = [
    path("apply/", ApplyToJobView.as_view(), name="apply-job"),
    path("employer/",EmployerApplicationView.as_view(),name="employer-application"),
    path("update-status/<int:pk>/",UpdateApplicationStatusView.as_view(),name="update-status"),
    path("jobseeker/",JobseekerApplicationView.as_view(),name="jobseeker-application"),
]