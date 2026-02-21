<!--
# 🚛 FleetFlow: Production-Grade Logistics & Fleet Management System

![FleetFlow Banner Header Placeholder] 

**FleetFlow** is a comprehensive, RBAC-driven fleet management and logistics platform engineered to solve real-world operational bottlenecks. It bridges the gap between physical asset management, human resources, and financial analytics by providing dedicated, securely isolated workflows for different operational roles.

Built with performance and scalability in mind, FleetFlow manages the entire lifecycle of a logistics operation: from registering a vehicle and onboarding a driver, to dispatching a trip, tracking maintenance costs, and automatically calculating the Return on Investment (ROI) per asset.

---

## 🏗️ System Architecture & Workflow

FleetFlow relies on a robust Full-Stack JS architecture, deeply integrating a relational PostgreSQL database with a Next.js App Router frontend.

### Tech Stack
*   **Frontend**: Next.js (React), Tailwind CSS, Zustand (State Management), Lucide React (Icons)
*   **Backend**: Node.js, Express.js
*   **Database**: PostgreSQL managed via Prisma ORM
*   **Authentication**: JWT (JSON Web Tokens) with granular Role-Based Access Control (RBAC)
*   **Data Validation & Security**: bcryptjs for password hashing

### High-Level System Flow (Mermaid)

```mermaid
graph TD
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef database fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef role fill:#8b5cf6,stroke:#5b21b6,stroke-width:2px,color:#fff;

    subgraph Users / RBAC Roles
        admin[System Admin]:::role
        manager[Fleet Manager]:::role
        dispatcher[Trip Dispatcher]:::role
    end

    subgraph Client / Frontend Next.js
        ui_dash[Role-Based Dashboards]:::frontend
        ui_vehicles[Vehicle Registry]:::frontend
        ui_maintenance[Maintenance Logs]:::frontend
        ui_dispatch[Trip Dispatch]:::frontend
        ui_finance[Financial Engine]:::frontend
    end

    subgraph Server / Node.js API
        api_auth[Auth/JWT Middleware]:::backend
        api_vehicles[Vehicles API]:::backend
        api_trips[Trips API]:::backend
        api_maintenance[Maintenance API]:::backend
    end

    db[(PostgreSQL with Prisma)]:::database

    %% Connections
    admin -.-> ui_dash
    manager -.-> ui_dash
    dispatcher -.-> ui_dash

    ui_dash --> api_auth
    ui_vehicles --> api_vehicles
    ui_maintenance --> api_maintenance
    ui_dispatch --> api_trips
    
    api_auth --> db
    api_vehicles --> db
    api_trips --> db
    api_maintenance --> db
    
    %% Business Logic Connections
    db -- Updates Status to In Shop --> api_maintenance
    db -- Prevents Dispatching In Shop Vehicles --> api_trips
```

---

## 🗺️ System Mapping (Handwritten Architecture)

*(This section is reserved for handwritten system mappings and domain models outlining the raw business logic flows).*

---

## 🔐 Strict Role-Based Access Control (RBAC)

Security and data isolation are fundamental. The system enforces strict isolation between departments:

| Role | Access Level | Primary Responsibilities |
| :--- | :--- | :--- |
| **Admin** | Superuser (All Modules) | System oversight, user creation, resolving global conflicts. |
| **Fleet Manager** | Physical Assets Only | CRUD on Vehicles. Creates Maintenance logs. Retires vehicles (`Out of Service`). *Cannot dispatch trips or view revenue.* |
| **Trip Dispatcher** | Logistics Only | Creates Trips, assigns Available vehicles to On Duty drivers. Logs fuel and finalizes trip revenue. *Cannot maintain or retire vehicles.* |
| **Safety Officer** | HR / Compliance | Manages Driver Profiles, tracks License Expirations. Toggles Driver statuses (`Suspended`). |
| **Financial Analyst** | Financials / KPIs | View-only access to calculate Fleet Utilization, Fuel Efficiency, and per-vehicle ROI. |

---

## 📦 Core Modules & Capabilities

### 1. Vehicle & Asset Registry (Fleet Manager)
Controls the physical trucks, vans, and bikes. Captures vital metrics like `maxLoadCapacity`, initial `odometer`, and base `acquisitionCost`.
*   **Logic Protection**: An asset marked as `Out of Service` by a Manager instantly vanishes from the Dispatcher's available pool.

### 2. Service & Maintenance Engine (Fleet Manager)
A dedicated logging system for vehicle repairs.
*   **Automation**: Logging service automatically triggers a database query that alters the Vehicle's status to `In Shop`. The backend absolutely refuses to dispatch `In Shop` vehicles.

### 3. HR & Driver Compliance (Safety Officer)
Manages the human logistics element. Tracks driver licenses, vehicle-type compatibility, and expiry dates.
*   **Compliance Logic**: A trip cannot be dispatched to a driver marked as `Suspended` or whose license expiry date is in the past.

### 4. Smart Dispatching System (Dispatcher)
The heartbeat of the logistics flow.
*   **Dynamic Filtering**: When a dispatcher enters a cargo weight of *25,000kg*, the backend filters out vans and only returns Heavy Trucks.
*   **Live Operations**: Dispatching a trip locks both the driver and the vehicle into an `On Trip` status until the destination is reached.

### 5. Automated Financial & ROI Engine (Financial Analyst)
Every module ties back to the bottom line. The logic computes the true cost of ownership and operation per asset.
*   **Revenue Generation**: Trips record `estimatedTripPrice` and `actualTripPrice`.
*   **Cost Deductions**: Maintenance logs and Fuel logs subtract from specific vehicles.
*   **The Golden Ratio (Vehicle ROI)**:
    $$ ROI = \frac{\sum Revenue - (\sum Maintenance + \sum Fuel)}{Vehicle Acquisition Cost} $$

---

## 🚀 Future Roadmap (Pending Implementation)

While the core RBAC and database schemas are built, the following features are in active development:
1.  **Expense Validation API**: Reconciling `estimatedFuelPrice` entered by Dispatchers with literal physical receipt uploads.
2.  **Chart.js Analytics Layer**: Providing the Financial Analyst with visual burn-down charts of revenue vs. maintenance grouped by `VehicleType`.
3.  **PDF/CSV Payroll Exports**: One-click generation of driver payments based on completed trip distances.

---

## ⚙️ Local Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/FleetFlow.git
    cd FleetFlow
    ```

2.  **Backend Setup & Database Seeding**
    Ensure PostgreSQL is running locally on port 5432.
    ```bash
    cd backend
    npm install
    # Create a .env file with DATABASE_URL="postgresql://user:pass@localhost:5432/fleetflow"
    
    # Push the schema and apply the comprehensive seed data
    npx prisma db push
    node prisma/seed.js 
    
    npm run dev
    ```
    *Note: The seeder script automatically populates ready-to-test Admins, Fleet Managers, Dispatchers, Vehicles, and Drivers.*

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

4.  **Login Credentials (from Seed)**
    *   **Admin**: `admin@fleetflow.com` / `admin123`
    *   **Fleet Manager**: `manager@fleetflow.com` / `password123`
    *   **Trip Dispatcher**: `dispatcher@fleetflow.com` / `password123`

---
*Built with precision to ensure real-world vehicles don't break down mid-trip.*
-->
