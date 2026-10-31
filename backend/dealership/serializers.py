from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    preferredBranch = serializers.CharField(source="preferred_branch", required=False)

    class Meta:
        model = User
        fields = ("id", "name", "email", "phone", "role", "avatar", "address", "preferredBranch")
        read_only_fields = ("email",)

    name = serializers.CharField(source="get_full_name", read_only=True)

    def get_role(self, obj):
        return "admin" if obj.is_staff else "customer"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(max_length=150)
    name = serializers.CharField(write_only=True)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ("id", "name", "email", "password", "phone", "avatar", "address", "role")

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists."})
        attrs["email"] = email
        return attrs

    def create(self, validated_data):
        name = validated_data.pop("name")
        first_name, _, last_name = name.strip().partition(" ")
        email = validated_data.pop("email").lower()
        return User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            **validated_data,
        )


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs["username"] = attrs.get("email", attrs.get("username", "")).lower()
        return super().validate(attrs)


class VehicleSerializer(serializers.ModelSerializer):
    stockId = serializers.CharField(source="stock_id")
    bodyType = serializers.CharField(source="body_type")
    msrp = serializers.DecimalField(max_digits=12, decimal_places=2, allow_null=True, required=False)
    monthlyEstimate = serializers.DecimalField(source="monthly_estimate", max_digits=10, decimal_places=2)
    exteriorColor = serializers.CharField(source="exterior_color", required=False, allow_blank=True)
    interiorColor = serializers.CharField(source="interior_color", required=False, allow_blank=True)
    fuelType = serializers.CharField(source="fuel_type", required=False, allow_blank=True)
    drivetrain = serializers.CharField(required=False, allow_blank=True)
    fuelEconomy = serializers.CharField(source="fuel_economy", required=False, allow_blank=True)
    carfaxClean = serializers.BooleanField(source="carfax_clean", required=False)
    ownersCount = serializers.IntegerField(source="owners_count", required=False)
    serviceRecordsCount = serializers.IntegerField(source="service_records_count", required=False)
    inspectionScore = serializers.IntegerField(source="inspection_score", required=False)

    class Meta:
        model = Vehicle
        fields = (
            "id", "vin", "stockId", "make", "model", "year", "trim", "condition", "bodyType",
            "price", "msrp", "monthlyEstimate", "mileage", "exteriorColor", "interiorColor",
            "fuelType", "transmission", "drivetrain", "engine", "horsepower", "torque",
            "acceleration", "fuelEconomy", "images", "features", "status", "location",
            "warranty", "carfaxClean", "ownersCount", "serviceRecordsCount", "inspectionScore",
            "featured",
        )
        read_only_fields = ("id",)


class PartSerializer(serializers.ModelSerializer):
    partNumber = serializers.CharField(source="part_number")
    originalPrice = serializers.DecimalField(source="original_price", max_digits=10, decimal_places=2, allow_null=True, required=False)
    inStock = serializers.IntegerField(source="in_stock")
    reviewCount = serializers.IntegerField(source="review_count")
    isOem = serializers.BooleanField(source="is_oem")
    installationDifficulty = serializers.CharField(source="installation_difficulty", required=False, allow_blank=True)

    class Meta:
        model = Part
        fields = (
            "id", "partNumber", "name", "category", "price", "originalPrice", "brand", "inStock",
            "rating", "reviewCount", "image", "description", "compatibility", "isOem", "warranty",
            "installationDifficulty",
        )
        read_only_fields = ("id",)


class ServicePackageSerializer(serializers.ModelSerializer):
    estimatedHours = serializers.CharField(source="estimated_hours", required=False, allow_blank=True)
    includedItems = serializers.ListField(source="included_items", child=serializers.CharField(), required=False)

    class Meta:
        model = ServicePackage
        fields = ("id", "title", "category", "description", "price", "estimatedHours", "popular", "includedItems")
        read_only_fields = ("id",)


class BranchSerializer(serializers.ModelSerializer):
    serviceBays = serializers.IntegerField(source="service_bays")

    class Meta:
        model = Branch
        fields = ("id", "name", "address", "city", "phone", "hours", "serviceBays")
        read_only_fields = ("id",)


class EmployeeSerializer(serializers.ModelSerializer):
    activeAssignments = serializers.IntegerField(source="active_assignments")

    class Meta:
        model = Employee
        fields = ("id", "name", "role", "department", "email", "phone", "avatar", "status", "activeAssignments", "rating")
        read_only_fields = ("id",)


class TestDriveSerializer(serializers.ModelSerializer):
    vehicleId = serializers.PrimaryKeyRelatedField(source="vehicle", queryset=Vehicle.objects.all())
    vehicleName = serializers.SerializerMethodField()
    vehicleImage = serializers.SerializerMethodField()
    vehicleStockId = serializers.CharField(source="vehicle.stock_id", read_only=True)
    customerEmail = serializers.EmailField(source="customer_email")
    customerName = serializers.CharField(source="customer_name")
    customerPhone = serializers.CharField(source="customer_phone")
    licenseNumber = serializers.CharField(source="license_number", required=False, allow_blank=True)
    timeSlot = serializers.CharField(source="time_slot")
    salesAdvisor = serializers.CharField(source="sales_advisor", required=False, allow_blank=True)
    specialRequests = serializers.CharField(source="special_requests", required=False, allow_blank=True)
    bookingRef = serializers.SerializerMethodField()
    createdDate = serializers.SerializerMethodField()
    branch = serializers.CharField()

    class Meta:
        model = TestDrive
        fields = (
            "id", "bookingRef", "vehicleId", "vehicleName", "vehicleImage", "vehicleStockId",
            "customerName", "customerEmail", "customerPhone", "licenseNumber", "date", "timeSlot",
            "branch", "salesAdvisor", "status", "createdDate", "specialRequests",
        )
        read_only_fields = ("id", "bookingRef", "vehicleName", "vehicleImage", "vehicleStockId", "status", "createdDate")

    def get_vehicleName(self, obj):
        return f"{obj.vehicle.year} {obj.vehicle.make} {obj.vehicle.model}"

    def get_vehicleImage(self, obj):
        return obj.vehicle.images[0] if obj.vehicle.images else ""

    def get_bookingRef(self, obj):
        return f"TD-{str(obj.id).replace('-', '')[:8].upper()}"

    def get_createdDate(self, obj):
        return obj.created_at.date()

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["customer"] = request.user
        return super().create(validated_data)


class ServiceAppointmentSerializer(serializers.ModelSerializer):
    vehicleDetails = serializers.DictField(write_only=True)
    serviceIds = serializers.PrimaryKeyRelatedField(
        source="services", queryset=ServicePackage.objects.all(), many=True, write_only=True
    )
    serviceNames = serializers.SerializerMethodField()
    appointmentRef = serializers.SerializerMethodField()
    customerName = serializers.CharField(source="customer_name", required=False)
    customerEmail = serializers.EmailField(source="customer_email", required=False)
    customerPhone = serializers.CharField(source="customer_phone", required=False)
    totalEstimate = serializers.DecimalField(source="total_estimate", max_digits=10, decimal_places=2, required=False)
    timeSlot = serializers.CharField(source="time_slot")
    technicianAssigned = serializers.CharField(source="technician_assigned", required=False, allow_blank=True)
    bayNumber = serializers.IntegerField(source="bay_number", required=False, allow_null=True)
    pickupRequired = serializers.BooleanField(source="pickup_required", required=False)
    loanerCarRequired = serializers.BooleanField(source="loaner_car_required", required=False)
    progressPercent = serializers.IntegerField(source="progress_percent", read_only=True)
    inspectionLog = serializers.ListField(source="inspection_log", read_only=True)

    class Meta:
        model = ServiceAppointment
        fields = (
            "id", "appointmentRef", "customerName", "customerEmail", "customerPhone", "vehicleDetails",
            "serviceIds", "serviceNames", "totalEstimate", "date", "timeSlot", "branch",
            "technicianAssigned", "bayNumber", "status", "pickupRequired", "loanerCarRequired",
            "notes", "progressPercent", "inspectionLog",
        )
        read_only_fields = ("id", "appointmentRef", "serviceNames", "status", "progressPercent", "inspectionLog")

    def get_serviceNames(self, obj):
        return list(obj.services.values_list("title", flat=True))

    def get_appointmentRef(self, obj):
        return f"SRV-{str(obj.id).replace('-', '')[:8].upper()}"

    def to_internal_value(self, data):
        result = super().to_internal_value(data)
        details = data.get("vehicleDetails")
        if details is None and self.partial:
            return result
        if not isinstance(details, dict):
            raise serializers.ValidationError({"vehicleDetails": "A vehicle details object is required."})
        required = ("make", "model", "year")
        if any(not details.get(key) for key in required):
            raise serializers.ValidationError({"vehicleDetails": "Make, model and year are required."})
        result["_vehicle_details"] = details
        return result

    def create(self, validated_data):
        details = validated_data.pop("_vehicle_details")
        validated_data.pop("vehicleDetails", None)
        services = validated_data.pop("services")
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["customer"] = request.user
            validated_data.setdefault("customer_name", request.user.get_full_name() or request.user.email)
            validated_data.setdefault("customer_email", request.user.email)
            validated_data.setdefault("customer_phone", request.user.phone)
        else:
            for field in ("customer_name", "customer_email", "customer_phone"):
                if not validated_data.get(field):
                    raise serializers.ValidationError({field: "This field is required for guest bookings."})
        validated_data.update({
            "vehicle_make": details["make"],
            "vehicle_model": details["model"],
            "vehicle_year": details["year"],
            "license_plate": details.get("licensePlate", ""),
            "mileage": details.get("mileage", 0),
        })
        if not services:
            raise serializers.ValidationError({"serviceIds": "Select at least one service."})
        validated_data["total_estimate"] = sum((service.price for service in services), start=0)
        appointment = ServiceAppointment.objects.create(**validated_data)
        appointment.services.set(services)
        return appointment

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["vehicleDetails"] = {
            "make": instance.vehicle_make,
            "model": instance.vehicle_model,
            "year": instance.vehicle_year,
            "licensePlate": instance.license_plate,
            "mileage": instance.mileage,
        }
        data["serviceIds"] = [str(service.id) for service in instance.services.all()]
        return data


class OrderItemSerializer(serializers.ModelSerializer):
    partId = serializers.SerializerMethodField()
    partName = serializers.CharField(source="part_name")
    partNumber = serializers.CharField(source="part_number")

    class Meta:
        model = OrderItem
        fields = ("partId", "partName", "partNumber", "price", "quantity", "image")

    def get_partId(self, obj):
        return str(obj.part_id) if obj.part_id else ""


class OrderSerializer(serializers.ModelSerializer):
    orderNumber = serializers.CharField(source="order_number", read_only=True)
    shippingAddress = serializers.CharField(source="shipping_address")
    deliveryMethod = serializers.CharField(source="delivery_method")
    trackingNumber = serializers.CharField(source="tracking_number", read_only=True)
    paymentMethod = serializers.CharField(source="payment_method")
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id", "orderNumber", "date", "items", "subtotal", "discount", "shipping", "tax", "total",
            "status", "shippingAddress", "deliveryMethod", "trackingNumber", "paymentMethod",
        )
        read_only_fields = ("id", "date", "items", "subtotal", "discount", "shipping", "tax", "total", "status")


class CustomerCarSerializer(serializers.ModelSerializer):
    licensePlate = serializers.CharField(source="license_plate", required=False, allow_blank=True)
    lastServiceDate = serializers.DateField(source="last_service_date", required=False, allow_null=True)
    nextServiceDue = serializers.DateField(source="next_service_due", required=False, allow_null=True)

    class Meta:
        model = CustomerCar
        fields = ("id", "make", "model", "year", "vin", "licensePlate", "mileage", "lastServiceDate", "nextServiceDue", "image")
        read_only_fields = ("id",)
