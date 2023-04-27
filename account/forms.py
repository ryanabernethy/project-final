from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import UserAccount

  
class UserCreateForm(UserCreationForm):
    class Meta:
        model = UserAccount
        fields = ["identifying_number", "email", "first_name", "last_name", "birth_date", "gender", "password1", "password2", "is_patient", "is_staff"]