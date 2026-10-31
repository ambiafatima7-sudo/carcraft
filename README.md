# CarCraft - Automotive Inventory & Dealership Suite

CarCraft is a dealership application with a React/TypeScript frontend and a Django REST API. The API supports MySQL and uses SQLite automatically for local development when no database name is configured.

## Features

- Browse/filter vehicles, parts, and service packages from the API
- Register and sign in with email/password using JWT authentication
- Book test drives and service appointments
- Place parts orders with server-side prices, promo validation, and stock checks
- Customer garage and account records
- Staff-only vehicle management and service status updates
- Django admin for managing dealership data

Checkout records payment-method selections for demonstration only. It does not process or collect real payments.

## Requirements

- Node.js and npm
- Python 3.10+
- MySQL 8 for MySQL-backed local development (optional; SQLite is used if `DB_NAME` is not set)

## Set up the database

Install and start MySQL Server if it is not already available. In a MySQL client, create a database and a dedicated local user:

```sql
CREATE DATABASE carcraft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'carcraft'@'localhost' IDENTIFIED BY 'choose-a-local-password';
GRANT ALL PRIVILEGES ON carcraft.* TO 'carcraft'@'localhost';
```

In PowerShell, from the project root, configure the Django environment:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` and set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` to match your local MySQL setup. Keep this file private; it is ignored by Git. Do not put database credentials in frontend environment files.

To run with SQLite instead, leave `backend\.env` absent (or omit `DB_NAME`).

## Start the backend

Open a terminal at the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py createsuperuser
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/` and Django admin at `http://127.0.0.1:8000/admin/`. Use the superuser's email and password to sign in to the frontend with staff access.

`seed_demo` loads the sample vehicles, parts, services, branches, and employees from the checked-in catalog fixture at `backend/dealership/fixtures/demo_data.json`. It can be run again safely to update that sample catalog.

## Start the frontend

In a second terminal at the project root:

```powershell
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:3000`). The frontend uses `http://127.0.0.1:8000/api` by default. To use a different backend URL, set `VITE_API_URL` in a local frontend `.env.local` file.

## Useful checks

Run backend tests and checks from `backend`:

```powershell
python manage.py test dealership
python manage.py check
python manage.py makemigrations --check --dry-run
```

Run frontend checks from the project root:

```powershell
npm run lint
npm run build
```

## Project structure

```text
backend/
  config/       Django settings and URL routing
  dealership/   Models, API, migrations, tests, and demo catalog seed
src/
  components/   React screens and UI components
  context/      Shared application state
  data/         Frontend demo data used to seed the backend
  services/     Django API client
  types/        TypeScript data types
```
