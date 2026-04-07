from django.urls import path
from .views import JobListCreateView,SaveJobView,SavedJobsListView
from .views import AdminJobStatusUpdateView, AdminJobDeleteView
urlpatterns = [
    path("", JobListCreateView.as_view(), name="job-list-create"),
    path("save/", SaveJobView.as_view(), name="saved-job"),
    path("my-saved/", SavedJobsListView.as_view(), name="saved-view"),
    path("admin/<int:pk>/status/", AdminJobStatusUpdateView.as_view()),
    path("admin/<int:pk>/delete/", AdminJobDeleteView.as_view()),
]