from rest_framework import serializers
from .models import CustomUser, Client, Supplier
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.username
        token['email'] = user.email
        token['user_type'] = user.user_type 

        return token


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['name', 'number', 'email', 'address', 'postcode', 'company_name', 'dob', 'password']

    def create(self, validated_data):
        user_data = {
            'username': validated_data['email'],  # Assuming email as username
            'email': validated_data['email'],
            'password': validated_data['password'],
            'user_type': 'client'
        }
        user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
        validated_data['user'] = user
        client = Client.objects.create(**validated_data)
        return client


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'name', 'number', 'email', 'address', 'postcode', 'company_name', 'company_number', 
            'dob', 'company_address', 'company_postcode', 'company_type', 'company_description', 
            'company_logo', 'subcategories', 'password'
        ]

    def create(self, validated_data):
        user_data = {
            'username': validated_data['email'],  # Assuming email as username
            'email': validated_data['email'],
            'password': validated_data['password'],
            'user_type': 'supplier'
        }
        user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
        validated_data['user'] = user
        supplier = Supplier.objects.create(**validated_data)
        return supplier
