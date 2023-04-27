from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.http import HttpResponse


def send_notifying_email(appointment):
    subject = "Notification for visiting your doctor."
    email_template_name = "management/notify.html"

    c = {
        'site_name': settings.SITE_NAME,
        'appointment': appointment,
    }
    html_content = render_to_string(email_template_name, c)
    text_content = strip_tags(html_content)

    try:
        email = EmailMultiAlternatives(
            subject,
            text_content,
            settings.EMAIL_HOST_USER,
            [appointment.user.email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except BadHeaderError:
        return HttpResponse('Invalid header found.')
    return True