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

        # Since your CustomUser sets USERNAME_FIELD = 'email',
        # calling authenticate(username=email, password=password) is correct.
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError({"error": "Invalid email or password"})

        refresh = self.get_token(user)

        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        data.update({
            "user_id": user.id,
            "user_type": user.user_type,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        })

        return data

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Removed 'username'; using only email as the identifier
        fields = [
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
            # create_user() will handle hashing the password
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
        fields = [
            'company_name', 
            'email', 
            'password', 
            'first_name', 
            'last_name', 
            'number', 
            'address', 
            'postcode', 
            'dob'
        ]

    def create(self, validated_data):
        # Build user data without the username field
        user_data = {
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
            # Use the CustomUserSerializer to create the user
            user = CustomUserSerializer.create(CustomUserSerializer(), validated_data=user_data)
            # Remove user-specific fields from the validated_data
            for field in ['email', 'password', 'first_name', 'last_name', 'number', 'address', 'postcode', 'dob']:
                validated_data.pop(field, None)
            validated_data['user'] = user
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
        fields = [
            'company_name', 
            'company_number', 
            'company_address', 
            'company_postcode', 
            'company_type', 
            'company_description', 
            'company_logo', 
            'subcategories', 
            'email', 
            'password', 
            'first_name', 
            'last_name', 
            'number', 
            'address', 
            'postcode', 
            'dob'
        ]

    def create(self, validated_data):
        user_data = {
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
            for field in ['email', 'password', 'first_name', 'last_name', 'number', 'address', 'postcode', 'dob']:
                validated_data.pop(field, None)
            validated_data['user'] = user
            supplier = Supplier.objects.create(**validated_data)
            return supplier
        except IntegrityError:
            raise serializers.ValidationError("A user with that email already exists.")

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
