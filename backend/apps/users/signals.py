# apps/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Client, Supplier

@receiver(post_save, sender=CustomUser)
def create_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 'client':
            Client.objects.create(user=instance)
        elif instance.user_type == 'supplier':
            Supplier.objects.create(user=instance)
