from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from dealership.views import (
    BranchViewSet,
    CustomerCarViewSet,
    EmployeeViewSet,
    EmailTokenView,
    OrderViewSet,
    PartViewSet,
    RegisterView,
    ServiceAppointmentViewSet,
    ServicePackageViewSet,
    TestDriveViewSet,
    UserProfileView,
    VehicleViewSet,
)

router = DefaultRouter()
router.register("vehicles", VehicleViewSet)
router.register("products", PartViewSet)
router.register("services", ServicePackageViewSet)
router.register("branches", BranchViewSet)
router.register("employees", EmployeeViewSet)
router.register("test-drives", TestDriveViewSet, basename="test-drive")
router.register("appointments", ServiceAppointmentViewSet, basename="appointment")
router.register("orders", OrderViewSet, basename="order")
router.register("garage", CustomerCarViewSet, basename="garage")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/token/", EmailTokenView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/me/", UserProfileView.as_view(), name="user-profile"),
]
