from rest_framework import serializers
from .models import CustomUser, Client, Supplier
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.db import IntegrityError


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        refresh = self.get_token(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        data.update({"user_id": user.id, "email": user.email, "user_type": user.user_type})

        return data


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = CustomUser.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError({"email": "A user with that email already exists."})


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'number', 'email', 'address', 'postcode', 'company_name', 'dob', 'password']

    def create(self, validated_data):
        user_data = {
            'username': validated_data['email'],  # Assuming email as username
            'email': validated_data['email'],
            'password': validated_data['password'],
            'user_type': 'client'
        }
        try:
            user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
            validated_data['user'] = user
            client = Client.objects.create(**validated_data)
            return client
        except IntegrityError:
            raise serializers.ValidationError({"email": "A user with that email already exists."})


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'first_name', 'last_name', 'number', 'email', 'address', 'postcode', 'company_name', 'company_number', 
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
        try:
            user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
            validated_data['user'] = user
            supplier = Supplier.objects.create(**validated_data)
            return supplier
        except IntegrityError:
            raise serializers.ValidationError({"email": "A user with that email already exists."})
