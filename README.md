# CarCraft - Automotive Inventory & Dealership Suite

CarCraft is a React frontend prototype for an automotive dealership. It includes vehicle browsing, parts shopping, service booking, customer account views, and dealership administration screens.

## Technology

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React icons and Motion animations

## Run locally

Run these commands from the project root (the directory containing `package.json`):

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:3000`).

Other available commands:

```powershell
npm run build
npm run preview
npm run lint
```

## Features

- Browse and compare vehicles, with search and filtering
- View vehicle details and submit test-drive bookings
- Browse parts and accessories, manage a cart, and place sample orders
- Browse service packages and book appointments
- View a customer account and dealership administration screens
- Switch between sample customer and admin roles in the interface

## Data and backend status

This repository currently contains the frontend only. It does not include a Django or other backend server, a database, or API endpoints. The interface uses sample data from `src/data/mockData.ts`; selected data is saved in the browser's `localStorage`. Actions in this prototype do not create real bookings, orders, or server-side accounts.

## Project structure

```text
src/
  components/  UI screens and reusable components
  context/     Shared application state
  data/        Sample dealership data
  types/       TypeScript data types
```
