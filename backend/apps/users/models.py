# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = None  # Remove username field
    USER_TYPE_CHOICES = (
        ('client', 'Client'),
        ('supplier', 'Supplier'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='client')
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    postcode = models.CharField(max_length=20)
    dob = models.DateField(default='2000-01-01')
    password = models.CharField(max_length=128)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.user_type})"


class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Client: {self.user.email}"


class Supplier(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(max_length=255)
    company_number = models.CharField(max_length=20)
    company_address = models.CharField(max_length=255)
    company_postcode = models.CharField(max_length=20)
    company_type = models.CharField(max_length=255)
    company_description = models.CharField(max_length=250)
    company_logo = models.ImageField(upload_to='logos/')
    subcategories = models.CharField(max_length=255)

    def __str__(self):
        return f"Supplier: {self.user.email}"
