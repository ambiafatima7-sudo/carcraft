from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import (
    Branch,
    CustomerCar,
    Employee,
    Order,
    OrderItem,
    Part,
    ServiceAppointment,
    ServicePackage,
    TestDrive,
    User,
    Vehicle,
)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Dealership profile", {"fields": ("phone", "avatar", "address", "preferred_branch")}),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Dealership profile", {"fields": ("email", "phone")}),
    )
    list_display = ("username", "email", "first_name", "last_name", "is_staff")


admin.site.register((Vehicle, Part, ServicePackage, Branch, Employee, TestDrive, ServiceAppointment, Order, OrderItem, CustomerCar))
