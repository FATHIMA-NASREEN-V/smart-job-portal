from django.db import models
from django.conf import settings

# Create your models here.
class Job(models.Model):
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    skills_required = models.TextField(blank=True, null=True)
    salary = models.DecimalField(max_digits=10,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES =[
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
    ]

    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')

    JOB_TYPE_CHOICES =[
        ('full_time','Full_Time'),
        ('part_time','Part_Time'),
        ('remote','Remote'),
        ('internship','Internship'),
    ]

    job_type = models.CharField(max_length=20,choices=JOB_TYPE_CHOICES,default='full_time')

    def __str__(self):
        return self.title

class SavedJob(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="saved_jobs")
    job = models.ForeignKey(Job,on_delete=models.CASCADE,related_name="saved_by")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user','job']

    def __str__(self):
        return f"{self.user} saved {self.job}"