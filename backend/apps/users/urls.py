from django.urls import path
from .views import ClientCreateView, SupplierCreateView, UserDetailsView, DeleteAccountView, ChangePasswordView, UpdateUserView
from .views import MyTokenObtainPairView, MyTokenRefreshView

urlpatterns = [
    path('clients/', ClientCreateView.as_view(), name='client-create'),
    path('suppliers/', SupplierCreateView.as_view(), name='supplier-create'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('user/delete/', DeleteAccountView.as_view(), name='delete'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/update/', UpdateUserView.as_view(), name='update-user'),
]