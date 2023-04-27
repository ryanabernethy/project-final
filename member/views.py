from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.response import Response
import random
import string

from account.models import UserAccount
from member.models import Category
from .models import Token, DoctorProfile
from .helpers import send_signin_info, send_verification_mail


class AccountActivationView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        otp = request.data.get('otp', None)

        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})
        if otp is None:
            return Response({"message": "No OTP found.", "status": "fail"})

        try:
            token_obj = Token.objects.get(user__email=email, otp=otp)
            token_obj.user.is_verified = True 
            token_obj.user.save()
            return Response({"message": "Your email has been verified successfully", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Invalid OTP", "status": "fail"})


def generate_id():
    return ''.join(random.choices(string.digits, k=8))

def generate_password():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))

class RegisterDoctorView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)
        service_category = request.data.get('service_category', None)

        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})
        if first_name is None:
            return Response({"message": "First name is required.", "status": "fail"})
        if last_name is None:
            return Response({"message": "Last name is required.", "status": "fail"})
        if service_category is None:
            return Response({"message": "Category is required.", "status": "fail"})

        try:
            if UserAccount.objects.filter(email=email).first():
                return Response({"message": "The email is taken.", "status": "fail"})

            user_obj = UserAccount(
                identifying_number=generate_id(),
                email=email, 
                first_name=first_name, 
                last_name=last_name,
                is_staff=True
            )
            password = generate_password()
            user_obj.set_password(password)
            user_obj.save()

            category_obj = Category.objects.get(id=service_category)
            DoctorProfile.objects.create(
                user=user_obj,
                category_of_service=category_obj
            )

            send_signin_info(email, password)
            return Response({"message": "Account has been created successfully", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Account was not created! Try again.", "status": "fail"})


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

class SendOTPView(APIView):
    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({"message": "Email is required.", "status": "fail"})

        try:
            user_obj = UserAccount.objects.get(email=email)
            otp = generate_otp()
            Token.objects.create(
                user = user_obj,
                otp = otp
            )
            send_verification_mail(email, otp)
            return Response({"message": "New OTP has been sent.", "status": "success"})
        except ObjectDoesNotExist:
            return Response({"message": "Unknown email address!", "status": "fail"})