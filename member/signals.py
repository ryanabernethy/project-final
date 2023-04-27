from django.conf import settings 
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
import random
import string

from .models import Token
from .helpers import send_verification_mail

User = get_user_model()

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def send_otp(sender, instance, created, **kwargs):
    if created:
        if instance.is_patient == True:
            otp = generate_otp()
            Token.objects.create(
                user = instance,
                otp = otp
            )
            send_verification_mail(instance.email, otp)

post_save.connect(send_otp, sender=User)