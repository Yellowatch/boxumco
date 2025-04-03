from rest_framework import generics
from .models import Client, Supplier, CustomUser
from .serializers import ClientSerializer, SupplierSerializer, CustomUserSerializer, ChangePasswordSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .serializers import MyTokenObtainPairSerializer
from django.http import JsonResponse
from django.views import View


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    # You can customize the serializer if needed
    pass

class ClientCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class SupplierCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class UserDetailsView(APIView):
    def get(self, request):
        user = request.user
        user_data = CustomUserSerializer(user).data
        
        # Add MFA status based on confirmed TOTP device
        from .views import user_has_mfa  # or import from the appropriate module
        user_data['mfa_enabled'] = user_has_mfa(user)
        
        if user.user_type == 'client':
            client_data = ClientSerializer(user.client).data
            user_data['client'] = client_data
        elif user.user_type == 'supplier':
            supplier_data = SupplierSerializer(user.supplier).data
            user_data['supplier'] = supplier_data
        
        return Response(user_data)
    
class DeleteAccountView(APIView):
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return JsonResponse({'message': 'Account deleted successfully'}, status=200)
    
class ChangePasswordView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['current_password']):
                return Response({"current_password": ["Current password is incorrect."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password has been changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateUserView(APIView):
    def put(self, request):
        user = request.user
        user_serializer = CustomUserSerializer(user, data=request.data, partial=True)

        if user.user_type == 'client':
            client_serializer = ClientSerializer(user.client, data=request.data, partial=True)
        elif user.user_type == 'supplier':
            supplier_serializer = SupplierSerializer(user.supplier, data=request.data, partial=True)
        else:
            client_serializer = None
            supplier_serializer = None

        if user_serializer.is_valid():
            user_serializer.save()
            if client_serializer and client_serializer.is_valid():
                client_serializer.save()
            elif supplier_serializer and supplier_serializer.is_valid():
                supplier_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CheckIfClientView(View):
    permission_classes = [AllowAny]
    
    def get(self, request, email):
        try:
            user = CustomUser.objects.get(email=email)
            if user.user_type == 'client':
                return JsonResponse({'is_client': True, 'user_exists': True})
            return JsonResponse({'is_client': False, 'user_exists': True})
        except CustomUser.DoesNotExist:
            return JsonResponse({'is_client': False, 'user_exists': False})
        

# MFA:

from django.core import signing
from django.contrib.auth import authenticate, get_user_model
from django_otp.plugins.otp_totp.models import TOTPDevice

# Create a temporary MFA token that expires (e.g., 5 minutes)
def create_temp_mfa_token(user):
    return signing.dumps({'user_id': user.id})

# Validate the temporary token and return the user if valid
def validate_temp_token(temp_token):
    try:
        data = signing.loads(temp_token, max_age=300)  # Expires in 300 seconds (5 minutes)
        User = get_user_model()
        return User.objects.get(id=data.get('user_id'))
    except Exception:
        return None

# Check if the user has an active TOTP device (MFA enabled)
def user_has_mfa(user):
    device = TOTPDevice.objects.filter(user=user, confirmed=True).first()
    return device is not None

# Verify the provided MFA code against the user’s TOTP device
def verify_mfa_code(user, mfa_code):
    device = TOTPDevice.objects.filter(user=user, confirmed=True).first()
    if device and device.verify_token(mfa_code):
        return True
    return False

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class LoginWithMFAView(APIView):
    permission_classes = []  # AllowAny

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user:
            if user_has_mfa(user):
                temp_token = create_temp_mfa_token(user)
                return Response(
                    {'detail': 'MFA required', 'temp_token': temp_token},
                    status=status.HTTP_202_ACCEPTED
                )
            else:
                # No MFA enabled: issue tokens immediately
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class MFAValidationView(APIView):
    permission_classes = []  # AllowAny

    def post(self, request):
        temp_token = request.data.get('temp_token')
        mfa_code = request.data.get('mfa_code')
        user = validate_temp_token(temp_token)
        if user and verify_mfa_code(user, mfa_code):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid MFA code or expired token'}, status=status.HTTP_400_BAD_REQUEST)

import base64
import pyotp
import qrcode
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django_otp.plugins.otp_totp.models import TOTPDevice

class EnableMFAView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Check if there's already an unconfirmed TOTP device for this user.
        totp_device = TOTPDevice.objects.filter(user=user, confirmed=False).first()
        if not totp_device:
            totp_device = TOTPDevice.objects.create(user=user, name="default", confirmed=False)
        
        # Convert the device's key from hex to Base32.
        b32_key = base64.b32encode(bytes.fromhex(totp_device.key)).decode('utf-8')
        totp = pyotp.TOTP(b32_key)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="BoxumCo")
        
        # Generate a QR code image for the provisioning URI.
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        img = qr.make_image(fill="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        qr_code_b64 = base64.b64encode(buffered.getvalue()).decode()
        
        return Response({
            'provisioning_uri': provisioning_uri,
            'qr_code': qr_code_b64,
        }, status=status.HTTP_200_OK)

class ConfirmMFASetupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        mfa_code = request.data.get('mfa_code')
        # Retrieve the unconfirmed TOTP device for the user
        totp_device = TOTPDevice.objects.filter(user=user, confirmed=False).first()
        if totp_device:
            # Convert the stored key from hex to Base32
            b32_key = base64.b32encode(bytes.fromhex(totp_device.key)).decode('utf-8')
            totp = pyotp.TOTP(b32_key)
            if totp.verify(mfa_code):
                totp_device.confirmed = True
                totp_device.save()
                return Response({'detail': 'MFA enabled successfully'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid MFA code or no pending MFA setup'}, status=status.HTTP_400_BAD_REQUEST)
    
class DisableMFAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        # Optionally, you could require the current MFA token in the request data for extra security.
        totp_device = TOTPDevice.objects.filter(user=user, confirmed=True).first()
        if totp_device:
            totp_device.delete()  # Remove the MFA device
            return Response({'detail': 'MFA has been disabled successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No active MFA setup found.'}, status=status.HTTP_400_BAD_REQUEST)
