from django.contrib import admin

from .models import Appointment, Diagnosis, Notification

admin.site.register(Appointment)
admin.site.register(Diagnosis)
admin.site.register(Notification)