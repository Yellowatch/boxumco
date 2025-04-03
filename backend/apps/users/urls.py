from django.urls import path
from .views import (
    ClientCreateView, SupplierCreateView, UserDetailsView, DeleteAccountView,
    ChangePasswordView, UpdateUserView, CheckIfClientView,
    MyTokenObtainPairView, MyTokenRefreshView, 
    LoginWithMFAView, MFAValidationView, EnableMFAView, ConfirmMFASetupView, DisableMFAView
)

urlpatterns = [
    path('clients/', ClientCreateView.as_view(), name='client-create'),
    path('suppliers/', SupplierCreateView.as_view(), name='supplier-create'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('user/', UserDetailsView.as_view(), name='user-details'),
    path('user/delete/', DeleteAccountView.as_view(), name='delete'),
    path('user/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/update/', UpdateUserView.as_view(), name='update-user'),
    path('check-if-client/<str:email>/', CheckIfClientView.as_view(), name='check-if-client'),
    path('token/login/', LoginWithMFAView.as_view(), name='token_login'),
    path('token/mfa/', MFAValidationView.as_view(), name='mfa_validation'),
    path('mfa/enable/', EnableMFAView.as_view(), name='enable_mfa'),
    path('mfa/confirm/', ConfirmMFASetupView.as_view(), name='confirm_mfa'),
    path('mfa/disable/', DisableMFAView.as_view(), name='disable_mfa'),
]