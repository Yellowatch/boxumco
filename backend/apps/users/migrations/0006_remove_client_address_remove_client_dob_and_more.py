# Generated by Django 5.1.6 on 2025-03-05 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_client_company_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='client',
            name='address',
        ),
        migrations.RemoveField(
            model_name='client',
            name='dob',
        ),
        migrations.RemoveField(
            model_name='client',
            name='email',
        ),
        migrations.RemoveField(
            model_name='client',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='client',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='client',
            name='number',
        ),
        migrations.RemoveField(
            model_name='client',
            name='password',
        ),
        migrations.RemoveField(
            model_name='client',
            name='postcode',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='address',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='dob',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='email',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='number',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='password',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='postcode',
        ),
        migrations.AddField(
            model_name='customuser',
            name='address',
            field=models.CharField(default='24 wisla cct', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='dob',
            field=models.DateField(default='2001-06-08'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='number',
            field=models.CharField(default='0414391716', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customuser',
            name='postcode',
            field=models.CharField(default='3037', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customuser',
            name='first_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='last_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='password',
            field=models.CharField(max_length=128),
        ),
    ]
