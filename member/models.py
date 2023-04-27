from django.db import models
from django.conf import settings


User = settings.AUTH_USER_MODEL

class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.PositiveIntegerField()

    def __str__(self):
        return self.user.email


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    category_of_service = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email