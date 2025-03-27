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