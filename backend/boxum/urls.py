# boxum/urls.py
from django.contrib import admin
from django.urls import path, include
from boxum.views import (
    health_check,
)

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/client/', include('apps.client.urls')),
    path('api/supplier/', include('apps.supplier.urls')),
    
    # dj-rest-auth endpoints for login, logout, etc.
    path('auth/', include('dj_rest_auth.urls')),
    
    # Registration endpoints (uses django-allauth under the hood)
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
]
