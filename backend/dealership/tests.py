from datetime import date, timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Order, Part, ServicePackage, Vehicle

User = get_user_model()


class DealershipApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.vehicle = Vehicle.objects.create(
            vin="TESTVIN00000000001",
            stock_id="TEST-001",
            make="CarCraft",
            model="Demo",
            year=2025,
            condition="New",
            body_type="Sedan",
            price=Decimal("25000.00"),
            monthly_estimate=Decimal("350.00"),
            images=["https://example.test/car.jpg"],
        )
        self.part = Part.objects.create(
            part_number="TEST-PART-001",
            name="Test part",
            category="Maintenance",
            price=Decimal("100.00"),
            brand="CarCraft",
            in_stock=3,
        )
        self.service = ServicePackage.objects.create(
            title="Oil service",
            category="Maintenance",
            price=Decimal("100.00"),
        )

    def register_customer(self, email="customer@example.com"):
        response = self.client.post(
            "/api/register/",
            {"name": "Test Customer", "email": email, "password": "StrongPass!234"},
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        return User.objects.get(email=email)

    def test_registration_and_email_login_issue_jwt(self):
        response = self.client.post(
            "/api/register/",
            {
                "name": "Test Customer",
                "email": "customer@example.com",
                "password": "StrongPass!234",
                "role": "admin",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["user"]["role"], "customer")
        duplicate = self.client.post(
            "/api/register/",
            {"name": "Duplicate", "email": "CUSTOMER@example.com", "password": "StrongPass!234"},
            format="json",
        )
        self.assertEqual(duplicate.status_code, 400)
        response = self.client.post(
            "/api/token/",
            {"email": "CUSTOMER@example.com", "password": "StrongPass!234"},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["role"], "customer")

    def test_public_vehicle_catalog_and_staff_only_writes(self):
        response = self.client.get("/api/vehicles/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["stockId"], "TEST-001")
        denied = self.client.post("/api/vehicles/", {"make": "Unauthorized"}, format="json")
        self.assertEqual(denied.status_code, 401)

    def test_customer_can_book_test_drive_and_only_list_own(self):
        customer = self.register_customer()
        self.client.force_authenticate(customer)
        response = self.client.post(
            "/api/test-drives/",
            {
                "vehicleId": str(self.vehicle.id),
                "customerName": "Test Customer",
                "customerEmail": customer.email,
                "customerPhone": "555-0100",
                "date": (date.today() + timedelta(days=2)).isoformat(),
                "timeSlot": "11:00 AM - 11:45 AM",
                "branch": "Main branch",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["vehicleStockId"], "TEST-001")
        self.assertEqual(self.client.get("/api/test-drives/").data["count"], 1)

    def test_guest_cannot_create_customer_bookings(self):
        test_drive = self.client.post(
            "/api/test-drives/",
            {
                "vehicleId": str(self.vehicle.id),
                "customerName": "Guest",
                "customerEmail": "guest@example.com",
                "customerPhone": "555-0100",
                "date": (date.today() + timedelta(days=2)).isoformat(),
                "timeSlot": "11:00 AM - 11:45 AM",
                "branch": "Main branch",
            },
            format="json",
        )
        appointment = self.client.post("/api/appointments/", {}, format="json")
        self.assertEqual(test_drive.status_code, 401)
        self.assertEqual(appointment.status_code, 401)

    def test_checkout_uses_database_price_and_decrements_inventory(self):
        customer = self.register_customer()
        self.client.force_authenticate(customer)
        response = self.client.post(
            "/api/orders/",
            {
                "items": [{"partId": str(self.part.id), "quantity": 2}],
                "shippingAddress": "100 Main Street",
                "deliveryMethod": "Express Delivery",
                "paymentMethod": "Card ending 4242",
                "promoCode": "CARCRAFT10",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(Part.objects.get(pk=self.part.pk).in_stock, 1)
        self.assertEqual(response.data["subtotal"], "200.00")
        self.assertEqual(response.data["discount"], "20.00")
        self.assertEqual(Order.objects.count(), 1)

    def test_checkout_rejects_insufficient_stock_without_creating_order(self):
        customer = self.register_customer()
        self.client.force_authenticate(customer)
        response = self.client.post(
            "/api/orders/",
            {
                "items": [{"partId": str(self.part.id), "quantity": 4}],
                "shippingAddress": "100 Main Street",
                "deliveryMethod": "Express Delivery",
                "paymentMethod": "Card",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Part.objects.get(pk=self.part.pk).in_stock, 3)
        self.assertEqual(Order.objects.count(), 0)

    def test_customer_service_appointment_persists_services_and_vehicle_details(self):
        customer = self.register_customer()
        self.client.force_authenticate(customer)
        booking = {
            "customerName": "Guest Customer",
            "customerEmail": "guest@example.com",
            "customerPhone": "555-0101",
            "vehicleDetails": {
                "make": "CarCraft",
                "model": "Demo",
                "year": 2025,
                "licensePlate": "ABC123",
                "mileage": 1000,
            },
            "serviceIds": [str(self.service.id)],
            "date": (date.today() + timedelta(days=3)).isoformat(),
            "timeSlot": "10:00 AM",
            "branch": "Main branch",
            "pickupRequired": False,
            "loanerCarRequired": False,
        }
        response = self.client.post(
            "/api/appointments/",
            booking,
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["serviceNames"], ["Oil service"])
        self.assertEqual(response.data["vehicleDetails"]["licensePlate"], "ABC123")
        conflict = self.client.post("/api/appointments/", booking, format="json")
        self.assertEqual(conflict.status_code, 400)
