from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.http import HttpResponse


def send_verification_mail(email_address, otp):
    subject = "Verify Your Email Address"
    email_template_name = "member/verify_email.html"

    c = {
        'site_name': settings.SITE_NAME,
        'otp': otp
    }
    html_content = render_to_string(email_template_name, c)
    text_content = strip_tags(html_content)

    try:
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.EMAIL_HOST_USER,
            [email_address]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except BadHeaderError:
        return HttpResponse('Invalid header found.')
    return True


def send_signin_info(email_address, password):
    subject = "Your credentials to sign in to Medical Appointment Booking System"
    email_template_name = "member/signin_credential.html"

    c = {
        'site_name': settings.SITE_NAME,
        'email_address': email_address,
        'password': password,
    }
    html_content = render_to_string(email_template_name, c)
    text_content = strip_tags(html_content)

    try:
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.EMAIL_HOST_USER,
            [email_address]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except BadHeaderError:
        return HttpResponse('Invalid header found.')
    return True
