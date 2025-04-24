# apps/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .models import Client

@receiver(post_save, sender=Client)
def send_client_registration_email(sender, instance, created, **kwargs):
    if not created:
        return
    user = instance.user

    # 1) Generate the one-time token for this user
    token = default_token_generator.make_token(user)

    # 2) Encode the user's PK into a URL-safe base64 string
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

    # 3) Build the confirmation URL path (named URL pattern 'confirm-email')
    path = reverse('confirm-email')  # e.g. '/api/users/confirm-email/'

    # 4) Construct the full URL, including domain
    #    Here we assume you have access to the request via settings.SITE_DOMAIN,
    #    or you could store it in settings and concatenate.
    domain = settings.FRONTEND_CONFIRMATION_HOST  # e.g. 'https://app.example.com'
    confirmation_url = f"{domain}{path}?uid={uidb64}&token={token}"

    # 5) Send the email
    subject = "Confirm Your Email for Boxum"
    message = (
        f"Hello {user.first_name},\n\n"
        "Thanks for signing up as a client on Boxum! To activate your account, please click the link below:\n\n"
        f"{confirmation_url}\n\n"
        "If you didn’t sign up, you can safely ignore this email.\n\n"
        "Best regards,\n"
        "The Boxum Team"
    )
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
