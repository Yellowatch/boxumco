from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('client', 'Client'),
        ('supplier', 'Supplier'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='client')

    def __str__(self):
        return f"{self.username} ({self.user_type})"

class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    postcode = models.CharField(max_length=20)
    company_name = models.CharField(max_length=255)
    dob = models.DateField()
    password = models.CharField(max_length=128)

class Supplier(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    postcode = models.CharField(max_length=20)
    company_name = models.CharField(max_length=255)
    company_number = models.CharField(max_length=20)
    dob = models.DateField()
    company_address = models.CharField(max_length=255)
    company_postcode = models.CharField(max_length=20)
    company_type = models.CharField(max_length=255)
    company_description = models.CharField(max_length=250)
    company_logo = models.ImageField(upload_to='logos/')
    subcategories = models.CharField(max_length=255)
    password = models.CharField(max_length=128)