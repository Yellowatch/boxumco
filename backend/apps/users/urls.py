from django.urls import path
from .views import ClientCreateView, SupplierCreateView
from .views import MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    path('clients/', ClientCreateView.as_view(), name='client-create'),
    path('suppliers/', SupplierCreateView.as_view(), name='supplier-create'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
]