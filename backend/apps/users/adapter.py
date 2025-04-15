# apps/users/adapter.py
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_verification_redirect_url(self, request, email_address):
        # This method is called after the user clicks the email verification link.
        return "http://localhost:5173/login?email_confirmed=1"
