from django.db import models
from django.conf import settings

from member.models import Category, DoctorProfile


class Diagnosis(models.Model):
    name = models.CharField(max_length=200)
    disease_category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Diagnosis'

    def __str__(self):
        return self.name


class Appointment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    identifying_number = models.CharField(max_length=8)
    disease_category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.SET_NULL, null=True)
    symptom = models.CharField(max_length=255, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.SET_NULL, blank=True, null=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)
    visited = models.BooleanField(default=False)

    def __str__(self):
        return self.identifying_number
    

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email