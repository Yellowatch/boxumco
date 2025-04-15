# apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation

User = get_user_model()

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'user_type', 'first_name', 'last_name', 'number', 'address', 'postcode', 'dob']

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'number', 'address', 'postcode', 'dob']

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

class DeleteAccountSerializer(serializers.Serializer):
    confirm = serializers.BooleanField(required=True)
