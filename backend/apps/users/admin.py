from django.contrib import admin
from .models import CustomUser, Client, Supplier

class CustomUserAdmin(admin.ModelAdmin):
    # Replace 'username' with 'email' in list_display and search_fields
    list_display = ('email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('user_type', 'is_staff', 'is_active')

class ClientAdmin(admin.ModelAdmin):
    # Update search_fields to use email in related user
    list_display = ('user', 'company_name')
    search_fields = ('user__email', 'company_name')
    list_filter = ('company_name',)

class SupplierAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'company_number', 'company_address', 'company_postcode', 'company_type', 'company_description', 'company_logo', 'subcategories')
    search_fields = ('user__email', 'company_name', 'company_number')
    list_filter = ('company_name', 'company_type')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Supplier, SupplierAdmin)
