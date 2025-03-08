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
            raise serializers.ValidationError({"error": "Invalid email or password"})

        refresh = self.get_token(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        print(user.first_name)

        data.update({"user_id": user.id, "email": user.email, "user_type": user.user_type, "first_name": user.first_name, "last_name": user.last_name})

        return data


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 
            'password', 
            'user_type', 
            'first_name', 
            'last_name', 
            'number', 
            'email', 
            'address', 
            'postcode', 
            'dob'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = CustomUser.objects.create_user(**validated_data)
            return user
        except IntegrityError:
            raise serializers.ValidationError("A user with that email already exists.")

class ClientSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    number = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    postcode = serializers.CharField(write_only=True)
    dob = serializers.DateField(write_only=True)

    class Meta:
        model = Client
        fields = ['company_name', 'email', 'password', 'first_name', 'last_name', 'number', 'address', 'postcode', 'dob']

    def create(self, validated_data):
        user_data = {
            'username': validated_data['email'],  # Assuming email as username
            'email': validated_data['email'],
            'password': validated_data['password'],
            'user_type': 'client',
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'number': validated_data['number'],
            'address': validated_data['address'],
            'postcode': validated_data['postcode'],
            'dob': validated_data['dob']
        }
        try:
            user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
            validated_data['user'] = user
            validated_data.pop('email')
            validated_data.pop('password')
            validated_data.pop('first_name')
            validated_data.pop('last_name')
            validated_data.pop('number')
            validated_data.pop('address')
            validated_data.pop('postcode')
            validated_data.pop('dob')
            client = Client.objects.create(**validated_data)
            return client
        except IntegrityError:
            raise serializers.ValidationError("A user with that email already exists.")

class SupplierSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    number = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    postcode = serializers.CharField(write_only=True)
    dob = serializers.DateField(write_only=True)

    class Meta:
        model = Supplier
        fields = ['company_name', 'company_number', 'company_address', 'company_postcode', 'company_type', 'company_description', 'company_logo', 'subcategories', 'email', 'password', 'first_name', 'last_name', 'number', 'address', 'postcode', 'dob']

    def create(self, validated_data):
        user_data = {
            'username': validated_data['email'],  # Assuming email as username
            'email': validated_data['email'],
            'password': validated_data['password'],
            'user_type': 'supplier',
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'number': validated_data['number'],
            'address': validated_data['address'],
            'postcode': validated_data['postcode'],
            'dob': validated_data['dob']
        }
        try:
            user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
            validated_data['user'] = user
            validated_data.pop('email')
            validated_data.pop('password')
            validated_data.pop('first_name')
            validated_data.pop('last_name')
            validated_data.pop('number')
            validated_data.pop('address')
            validated_data.pop('postcode')
            validated_data.pop('dob')
            supplier = Supplier.objects.create(**validated_data)
            return supplier
        except IntegrityError:
            raise serializers.ValidationError("A user with that email already exists.")