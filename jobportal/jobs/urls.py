from django.urls import path
from .views import JobListCreateView,SaveJobView,SavedJobsListView

urlpatterns = [
    path("", JobListCreateView.as_view(), name="job-list-create"),
    path("save/", SaveJobView.as_view(), name="saved-job"),
    path("my-saved/", SavedJobsListView.as_view(), name="saved-view"),

]