from django.urls import path
from .views import AccountActivationView, RegisterDoctorView, SendOTPView


urlpatterns = [
    path('account-activation/', AccountActivationView.as_view()),
    path('send-otp/', SendOTPView.as_view()),
    path('register-doctor/', RegisterDoctorView.as_view()),
]