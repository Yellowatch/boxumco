# boxum/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/client/', include('apps.client.urls')),
    path('api/supplier/', include('apps.supplier.urls')),
]
