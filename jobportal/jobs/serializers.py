from rest_framework import serializers
from .models import Job
from .models import SavedJob

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ["employer"]

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = "__all__"
        read_only_fields = ['user']