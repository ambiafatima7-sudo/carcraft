import json
from pathlib import Path

from django.core.management.base import BaseCommand

from dealership.models import Branch, Employee, Part, ServicePackage, Vehicle


FIXTURE = Path(__file__).resolve().parents[2] / "fixtures" / "demo_data.json"


def rename_fields(data, mapping):
    return {mapping.get(key, key): value for key, value in data.items() if key != "id"}


class Command(BaseCommand):
    help = "Load or update the sample dealership catalog."

    def handle(self, *args, **options):
        with FIXTURE.open(encoding="utf-8") as file:
            data = json.load(file)

        vehicle_fields = {
            "stockId": "stock_id",
            "bodyType": "body_type",
            "monthlyEstimate": "monthly_estimate",
            "exteriorColor": "exterior_color",
            "interiorColor": "interior_color",
            "fuelType": "fuel_type",
            "fuelEconomy": "fuel_economy",
            "carfaxClean": "carfax_clean",
            "ownersCount": "owners_count",
            "serviceRecordsCount": "service_records_count",
            "inspectionScore": "inspection_score",
        }
        part_fields = {
            "partNumber": "part_number",
            "originalPrice": "original_price",
            "inStock": "in_stock",
            "reviewCount": "review_count",
            "isOem": "is_oem",
            "installationDifficulty": "installation_difficulty",
        }
        service_fields = {"estimatedHours": "estimated_hours", "includedItems": "included_items"}
        branch_fields = {"serviceBays": "service_bays"}
        employee_fields = {"activeAssignments": "active_assignments"}

        for item in data["vehicles"]:
            fields = rename_fields(item, vehicle_fields)
            Vehicle.objects.update_or_create(stock_id=fields["stock_id"], defaults=fields)
        for item in data["parts"]:
            fields = rename_fields(item, part_fields)
            Part.objects.update_or_create(part_number=fields["part_number"], defaults=fields)
        for item in data["services"]:
            fields = rename_fields(item, service_fields)
            ServicePackage.objects.update_or_create(title=fields["title"], defaults=fields)
        for item in data["branches"]:
            fields = rename_fields(item, branch_fields)
            Branch.objects.update_or_create(name=fields["name"], defaults=fields)
        for item in data["employees"]:
            fields = rename_fields(item, employee_fields)
            Employee.objects.update_or_create(email=fields["email"], defaults=fields)

        self.stdout.write(self.style.SUCCESS("Demo catalog loaded or updated successfully."))
