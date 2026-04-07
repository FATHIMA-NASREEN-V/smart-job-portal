from rest_framework import serializers
from .models import Job
from .models import SavedJob
from applications.models import Application   # 👈 import this

class JobSerializer(serializers.ModelSerializer):
    is_applied = serializers.SerializerMethodField() 
    is_saved = serializers.SerializerMethodField()  

    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ["employer"]

    def get_is_applied(self, obj):
        request = self.context.get("request")

        if not request or request.user.is_anonymous:
            return False

        return Application.objects.filter(
            job=obj,
            applicant=request.user
        ).exists()  

    def get_is_saved(self, obj):
        request = self.context.get("request")

        if not request or request.user.is_anonymous:
            return False

        return SavedJob.objects.filter(
            job=obj,
            user=request.user
        ).exists()      

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)   # 👈 nested object for GET response
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), source='job', write_only=True  # 👈 for POST request
    )

    class Meta:
        model = SavedJob
        fields = ["id", "job", "job_id", "user"]
        read_only_fields = ['user']