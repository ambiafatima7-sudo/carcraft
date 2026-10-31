import secrets
from datetime import date
from decimal import Decimal
from uuid import UUID

from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

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
    Vehicle,
)
from .permissions import StaffOrReadOnly
from .serializers import (
    BranchSerializer,
    CustomerCarSerializer,
    EmployeeSerializer,
    OrderSerializer,
    PartSerializer,
    RegisterSerializer,
    ServiceAppointmentSerializer,
    ServicePackageSerializer,
    TestDriveSerializer,
    UserSerializer,
    VehicleSerializer,
)

User = get_user_model()


class RegisterView(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class EmailTokenSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        account = User.objects.filter(email__iexact=email).first()
        user = authenticate(
            request=self.context.get("request"),
            username=account.get_username() if account else email,
            password=attrs.get("password"),
        )
        if user is None:
            raise ValidationError({"detail": "Email or password is incorrect."})
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
        }


class EmailTokenView(TokenObtainPairView):
    serializer_class = EmailTokenSerializer


class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [StaffOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        condition = self.request.query_params.get("condition")
        body_type = self.request.query_params.get("bodyType")
        make = self.request.query_params.get("make")
        if condition and condition != "All":
            queryset = queryset.filter(condition=condition)
        if body_type and body_type != "All":
            queryset = queryset.filter(body_type=body_type)
        if make:
            queryset = queryset.filter(make__iexact=make)
        return queryset


class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [StaffOrReadOnly]


class ServicePackageViewSet(viewsets.ModelViewSet):
    queryset = ServicePackage.objects.all()
    serializer_class = ServicePackageSerializer
    permission_classes = [StaffOrReadOnly]


class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.AllowAny]


class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [StaffOrReadOnly]


class OwnedOrStaffBookingViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return self.queryset.none()
        if user.is_staff:
            return self.queryset.all()
        return self.queryset.filter(customer=user)

    def perform_destroy(self, instance):
        if not self.request.user.is_staff and instance.customer_id != self.request.user.id:
            raise PermissionDenied("You can only change your own booking.")
        instance.delete()


class TestDriveViewSet(OwnedOrStaffBookingViewSet):
    queryset = TestDrive.objects.select_related("vehicle").all()
    serializer_class = TestDriveSerializer

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == TestDrive.Status.COMPLETED:
            raise ValidationError({"status": "Completed test drives cannot be cancelled."})
        booking.status = TestDrive.Status.CANCELLED
        booking.save(update_fields=["status"])
        return Response(self.get_serializer(booking).data)


class ServiceAppointmentViewSet(OwnedOrStaffBookingViewSet):
    queryset = ServiceAppointment.objects.prefetch_related("services").all()
    serializer_class = ServiceAppointmentSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve", "create", "cancel"}:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        appointment_date = serializer.validated_data["date"]
        if appointment_date < date.today():
            raise ValidationError({"date": "Appointments cannot be booked in the past."})
        slot = serializer.validated_data
        if ServiceAppointment.objects.filter(
            date=appointment_date,
            branch=slot["branch"],
            time_slot=slot["time_slot"],
        ).exclude(status=ServiceAppointment.Status.CANCELLED).exists():
            raise ValidationError({"timeSlot": "That workshop slot is already booked."})
        serializer.save()

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        if appointment.status in {ServiceAppointment.Status.COMPLETED, ServiceAppointment.Status.CANCELLED}:
            raise ValidationError({"status": "This appointment can no longer be cancelled."})
        appointment.status = ServiceAppointment.Status.CANCELLED
        appointment.save(update_fields=["status"])
        return Response(self.get_serializer(appointment).data)

    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAdminUser])
    def set_status(self, request, pk=None):
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        appointment.status = serializer.validated_data.get("status", appointment.status)
        appointment.bay_number = serializer.validated_data.get("bay_number", appointment.bay_number)
        appointment.technician_assigned = serializer.validated_data.get(
            "technician_assigned", appointment.technician_assigned
        )
        progress = {
            ServiceAppointment.Status.RECEIVED: 15,
            ServiceAppointment.Status.DIAGNOSTIC: 35,
            ServiceAppointment.Status.REPAIR: 65,
            ServiceAppointment.Status.QUALITY: 85,
            ServiceAppointment.Status.READY: 95,
            ServiceAppointment.Status.COMPLETED: 100,
        }
        appointment.progress_percent = progress.get(appointment.status, appointment.progress_percent)
        appointment.save()
        return Response(self.get_serializer(appointment).data)


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.prefetch_related("items").all()
        return queryset if self.request.user.is_staff else queryset.filter(customer=self.request.user)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionDenied("Sign in before placing an order.")
        items = request.data.get("items")
        if not isinstance(items, list) or not items:
            raise ValidationError({"items": "Add at least one item to the order."})
        delivery_method = request.data.get("deliveryMethod")
        if delivery_method not in Order.DeliveryMethod.values:
            raise ValidationError({"deliveryMethod": "Choose a supported delivery method."})
        address = str(request.data.get("shippingAddress", "")).strip()
        payment_method = str(request.data.get("paymentMethod", "")).strip()
        if not address or not payment_method:
            raise ValidationError({"detail": "Shipping address and payment method are required."})
        promo_code = str(request.data.get("promoCode", "")).strip().upper()
        rates = {"CARCRAFT10": Decimal("0.10"), "VIP10": Decimal("0.10"), "DRIVE15": Decimal("0.15")}
        if promo_code and promo_code not in rates:
            raise ValidationError({"promoCode": "This promo code is invalid."})

        with transaction.atomic():
            quantities = {}
            for item in items:
                try:
                    part_id = str(UUID(str(item["partId"])))
                    quantity = int(item["quantity"])
                except (KeyError, TypeError, ValueError, AttributeError):
                    raise ValidationError({"items": "Each item needs a valid partId and quantity."})
                if quantity < 1:
                    raise ValidationError({"items": "Item quantities must be positive."})
                quantities[part_id] = quantities.get(part_id, 0) + quantity
            parts = {
                str(part.id): part
                for part in Part.objects.select_for_update().filter(id__in=quantities.keys())
            }
            if len(parts) != len(quantities):
                raise ValidationError({"items": "One or more selected parts are unavailable."})
            for part_id, quantity in quantities.items():
                if parts[part_id].in_stock < quantity:
                    raise ValidationError({"items": f"Not enough stock for {parts[part_id].name}."})

            subtotal = sum(
                (parts[part_id].price * quantity for part_id, quantity in quantities.items()),
                start=Decimal("0.00"),
            )
            discount = (subtotal * rates.get(promo_code, Decimal("0"))).quantize(Decimal("0.01"))
            shipping = Decimal("0.00") if delivery_method == Order.DeliveryMethod.PICKUP else Decimal("25.00")
            tax = ((subtotal - discount) * Decimal("0.0825")).quantize(Decimal("0.01"))
            total = subtotal - discount + shipping + tax
            order = Order.objects.create(
                order_number=f"CC-{secrets.token_hex(4).upper()}",
                customer=request.user,
                subtotal=subtotal,
                discount=discount,
                shipping=shipping,
                tax=tax,
                total=total,
                shipping_address=address,
                delivery_method=delivery_method,
                payment_method=payment_method,
                tracking_number=f"CC-{secrets.token_hex(6).upper()}",
                status=(
                    Order.Status.READY_FOR_PICKUP
                    if delivery_method == Order.DeliveryMethod.PICKUP
                    else Order.Status.PROCESSING
                ),
            )
            order_items = []
            for part_id, quantity in quantities.items():
                part = parts[part_id]
                order_items.append(
                    OrderItem(
                        order=order,
                        part=part,
                        part_name=part.name,
                        part_number=part.part_number,
                        price=part.price,
                        quantity=quantity,
                        image=part.image,
                    )
                )
                Part.objects.filter(pk=part.pk).update(in_stock=F("in_stock") - quantity)
            OrderItem.objects.bulk_create(order_items)

        return Response(self.get_serializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        with transaction.atomic():
            order = get_object_or_404(self.get_queryset().select_for_update(), pk=pk)
            if order.status != Order.Status.PROCESSING:
                raise ValidationError({"status": "Only processing orders can be cancelled."})
            for item in order.items.select_related("part"):
                if item.part_id:
                    Part.objects.filter(pk=item.part_id).update(in_stock=F("in_stock") + item.quantity)
            order.status = Order.Status.CANCELLED
            order.save(update_fields=["status"])
        return Response(self.get_serializer(order).data)

    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAdminUser])
    def set_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status not in Order.Status.values:
            raise ValidationError({"status": "Choose a valid order status."})
        order.status = new_status
        order.save(update_fields=["status"])
        return Response(self.get_serializer(order).data)


class CustomerCarViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerCarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomerCar.objects.filter(customer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
