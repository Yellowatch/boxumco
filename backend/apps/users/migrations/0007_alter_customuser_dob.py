# Generated by Django 5.1.6 on 2025-03-05 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_remove_client_address_remove_client_dob_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='dob',
            field=models.DateField(default='2000-01-01'),
        ),
    ]
