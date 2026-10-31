import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=40, blank=True)
    avatar = models.URLField(blank=True)
    address = models.TextField(blank=True)
    preferred_branch = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.email


class Vehicle(models.Model):
    class Status(models.TextChoices):
        IN_STOCK = "In Stock", "In Stock"
        RESERVED = "Reserved", "Reserved"
        IN_SERVICE = "In Service", "In Service"
        SOLD = "Sold", "Sold"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vin = models.CharField(max_length=32, unique=True)
    stock_id = models.CharField(max_length=40, unique=True)
    make = models.CharField(max_length=80)
    model = models.CharField(max_length=100)
    year = models.PositiveSmallIntegerField(validators=[MinValueValidator(1886), MaxValueValidator(2100)])
    trim = models.CharField(max_length=120, blank=True)
    condition = models.CharField(max_length=32)
    body_type = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    msrp = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    monthly_estimate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    mileage = models.PositiveIntegerField(default=0)
    exterior_color = models.CharField(max_length=60, blank=True)
    interior_color = models.CharField(max_length=60, blank=True)
    fuel_type = models.CharField(max_length=32, blank=True)
    transmission = models.CharField(max_length=32, blank=True)
    drivetrain = models.CharField(max_length=16, blank=True)
    engine = models.CharField(max_length=120, blank=True)
    horsepower = models.PositiveIntegerField(default=0)
    torque = models.CharField(max_length=40, blank=True)
    acceleration = models.CharField(max_length=80, blank=True)
    fuel_economy = models.CharField(max_length=80, blank=True)
    images = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_STOCK)
    location = models.CharField(max_length=120, blank=True)
    warranty = models.CharField(max_length=120, blank=True)
    carfax_clean = models.BooleanField(default=False)
    owners_count = models.PositiveSmallIntegerField(default=0)
    service_records_count = models.PositiveSmallIntegerField(default=0)
    inspection_score = models.PositiveSmallIntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-featured", "-created_at"]

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"


class Part(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    part_number = models.CharField(max_length=80, unique=True)
    name = models.CharField(max_length=160)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    brand = models.CharField(max_length=100)
    in_stock = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True)
    description = models.TextField(blank=True)
    compatibility = models.JSONField(default=list, blank=True)
    is_oem = models.BooleanField(default=False)
    warranty = models.CharField(max_length=120, blank=True)
    installation_difficulty = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ServicePackage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=160)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_hours = models.CharField(max_length=32, blank=True)
    popular = models.BooleanField(default=False)
    included_items = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=160)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    hours = models.CharField(max_length=160, blank=True)
    service_bays = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return self.name


class Employee(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        IN_CONSULTATION = "In Consultation", "In Consultation"
        IN_BAY = "In Bay", "In Bay"
        ON_LEAVE = "On Leave", "On Leave"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=80)
    department = models.CharField(max_length=80)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    avatar = models.URLField(blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.AVAILABLE)
    active_assignments = models.PositiveSmallIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class TestDrive(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "Confirmed", "Confirmed"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="test_drives")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name="test_drives")
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=40)
    license_number = models.CharField(max_length=80, blank=True)
    date = models.DateField()
    time_slot = models.CharField(max_length=40)
    branch = models.CharField(max_length=160)
    sales_advisor = models.CharField(max_length=120, blank=True)
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class ServiceAppointment(models.Model):
    class Status(models.TextChoices):
        RECEIVED = "Received", "Received"
        DIAGNOSTIC = "Diagnostic Inspection", "Diagnostic Inspection"
        REPAIR = "Parts & Repair", "Parts & Repair"
        QUALITY = "Quality Check", "Quality Check"
        READY = "Ready for Delivery", "Ready for Delivery"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="service_appointments")
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=40)
    vehicle_make = models.CharField(max_length=80)
    vehicle_model = models.CharField(max_length=100)
    vehicle_year = models.PositiveSmallIntegerField()
    license_plate = models.CharField(max_length=24, blank=True)
    mileage = models.PositiveIntegerField(default=0)
    services = models.ManyToManyField(ServicePackage, related_name="appointments")
    total_estimate = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    time_slot = models.CharField(max_length=40)
    branch = models.CharField(max_length=160)
    technician_assigned = models.CharField(max_length=120, blank=True)
    bay_number = models.PositiveSmallIntegerField(null=True, blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.RECEIVED)
    pickup_required = models.BooleanField(default=False)
    loaner_car_required = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    progress_percent = models.PositiveSmallIntegerField(default=15)
    inspection_log = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class Order(models.Model):
    class Status(models.TextChoices):
        PROCESSING = "Processing", "Processing"
        SHIPPED = "Shipped", "Shipped"
        OUT_FOR_DELIVERY = "Out for Delivery", "Out for Delivery"
        DELIVERED = "Delivered", "Delivered"
        READY_FOR_PICKUP = "Ready for Pickup", "Ready for Pickup"
        CANCELLED = "Cancelled", "Cancelled"

    class DeliveryMethod(models.TextChoices):
        EXPRESS = "Express Delivery", "Express Delivery"
        PICKUP = "Dealership Pickup", "Dealership Pickup"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=32, unique=True)
    customer = models.ForeignKey(User, on_delete=models.PROTECT, related_name="orders")
    date = models.DateField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PROCESSING)
    shipping_address = models.TextField()
    delivery_method = models.CharField(max_length=32, choices=DeliveryMethod.choices)
    tracking_number = models.CharField(max_length=80, blank=True)
    payment_method = models.CharField(max_length=80)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    part = models.ForeignKey(Part, null=True, on_delete=models.SET_NULL, related_name="order_items")
    part_name = models.CharField(max_length=160)
    part_number = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    image = models.URLField(blank=True)


class CustomerCar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="garage")
    make = models.CharField(max_length=80)
    model = models.CharField(max_length=100)
    year = models.PositiveSmallIntegerField()
    vin = models.CharField(max_length=32, blank=True)
    license_plate = models.CharField(max_length=24, blank=True)
    mileage = models.PositiveIntegerField(default=0)
    last_service_date = models.DateField(null=True, blank=True)
    next_service_due = models.DateField(null=True, blank=True)
    image = models.URLField(blank=True)

    class Meta:
        ordering = ["-id"]
