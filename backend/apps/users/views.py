from rest_framework import generics
from .models import Client, Supplier
from .serializers import ClientSerializer, SupplierSerializer
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .serializers import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    # You can customize the serializer if needed
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
