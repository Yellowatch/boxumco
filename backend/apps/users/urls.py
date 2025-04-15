# apps/users/urls.py
from django.urls import path, include
from apps.users.views import (
    UserDetailsView,
    UpdateUserView,
    ChangePasswordView,
    DeleteAccountView,
)

urlpatterns = [
    path('', UserDetailsView.as_view(), name='user-details'),
    path('update/', UpdateUserView.as_view(), name='update-user'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('delete/', DeleteAccountView.as_view(), name='delete-account'),
    path('accounts/', include('allauth.urls')),
]
