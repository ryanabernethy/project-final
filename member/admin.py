from django.contrib import admin
from .models import Token, Category, DoctorProfile


admin.site.register(Token)
admin.site.register(Category)
admin.site.register(DoctorProfile)