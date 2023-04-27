from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models import UserAccount
from .forms import UserCreateForm


class UserAccountAdmin(UserAdmin):
    add_form = UserCreateForm
    list_display = ('identifying_number', 'email', 'first_name', 'last_name', 'is_patient', 'is_staff')
    list_display_links = ('email', 'first_name', 'last_name')
    list_filter = ('gender', 'is_active', 'is_patient', 'is_staff')
    ordering = ['-id']
    search_fields = ['identifying_number', 'email', 'first_name', 'last_name']
    readonly_fields= ('date_joined',)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"), 
            {
                "fields": (
                    "identifying_number",
                    "first_name", 
                    "last_name",
                    "birth_date",
                    "gender"
                )
            }
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_verified",
                    "is_patient",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'identifying_number',
                    'email', 
                    'first_name', 
                    'last_name',
                    'birth_date',
                    'gender', 
                    'password1', 
                    'password2', 
                    'is_verified',
                    'is_patient',
                    'is_staff'
                ),
            },
        ),
    )

admin.site.register(UserAccount, UserAccountAdmin)