const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const commonPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // Users
    const users = [
        { email: 'admin@fleetflow.com', name: 'System Admin', role: 'ADMIN', password: adminPassword },
        { email: 'manager@fleetflow.com', name: 'Fleet Manager', role: 'FLEET_MANAGER', password: commonPassword },
        { email: 'dispatcher@fleetflow.com', name: 'Trip Dispatcher', role: 'DISPATCHER', password: commonPassword },
        { email: 'safety@fleetflow.com', name: 'Safety Officer', role: 'SAFETY_OFFICER', password: commonPassword },
        { email: 'finance@fleetflow.com', name: 'Financial Analyst', role: 'FINANCIAL_ANALYST', password: commonPassword },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }

    console.log('Users seeded');

    // Vehicles
    const vehiclesData = [
        { name: 'Bharat Benz 5528', licensePlate: 'MH-12-PQ-1234', maxLoadCapacity: 25000, type: 'TRUCK', odometer: 15600, status: 'Available', acquisitionCost: 5000000 },
        { name: 'Tata Ultra T.7', licensePlate: 'MH-14-GH-5678', maxLoadCapacity: 7000, type: 'TRUCK', odometer: 8400, status: 'On Trip', acquisitionCost: 2500000 },
        { name: 'Mahindra Supro', licensePlate: 'MH-43-KL-9012', maxLoadCapacity: 1000, type: 'VAN', odometer: 12000, status: 'Available', acquisitionCost: 800000 },
        { name: 'Eicher Pro 2055', licensePlate: 'DL-01-AX-4321', maxLoadCapacity: 5000, type: 'TRUCK', odometer: 5000, status: 'In Shop', acquisitionCost: 2000000 },
        { name: 'Volvo FH16', licensePlate: 'TN-01-AB-1234', maxLoadCapacity: 40000, type: 'TRUCK', odometer: 2000, status: 'Available', acquisitionCost: 7500000 },
    ];

    for (const v of vehiclesData) {
        await prisma.vehicle.upsert({
            where: { licensePlate: v.licensePlate },
            update: v,
            create: v,
        });
    }

    console.log('Vehicles seeded');

    // Drivers
    const driversData = [
        { name: 'Rajesh Kumar', licenseExpiry: new Date('2028-12-31'), status: 'On Duty' },
        { name: 'Suresh Patil', licenseExpiry: new Date('2027-06-15'), status: 'On Duty' },
        { name: 'Amit Sharma', licenseExpiry: new Date('2029-01-10'), status: 'On Duty' },
        { name: 'Vikram Singh', licenseExpiry: new Date('2026-05-20'), status: 'Off Duty' },
    ];

    for (const d of driversData) {
        await prisma.driver.upsert({
            where: { id: driversData.indexOf(d) + 1 },
            update: { name: d.name, status: d.status, licenseExpiry: d.licenseExpiry },
            create: d,
        });
    }

    console.log('Drivers seeded');

    // Maintenance Logs for ROI calculation
    const maintenanceData = [
        { vehicleId: 1, serviceType: 'Oil Change', cost: 5000, date: new Date('2024-01-10'), status: 'Completed' },
        { vehicleId: 4, serviceType: 'Engine Repair', cost: 45000, date: new Date('2024-01-15'), status: 'Completed' },
    ];

    for (const m of maintenanceData) {
        await prisma.maintenanceLog.create({ data: m });
    }

    // Trips with Revenue
    const sampleTrips = [
        {
            tripId: 'TRIP-2024-001',
            vehicleId: 1,
            driverId: 1,
            cargoWeight: 15000,
            origin: 'Mumbai',
            destination: 'Pune',
            estimatedDistance: 150,
            estimatedFuelPricePerKm: 10,
            estimatedTripPrice: 20000,
            status: 'Completed',
            actualDistance: 160,
            actualFuelCost: 16000,
            revenue: 250000, // Rs. 2.5L
            endDate: new Date('2024-01-05')
        },
        {
            tripId: 'TRIP-2024-002',
            vehicleId: 2,
            driverId: 2,
            cargoWeight: 5000,
            origin: 'Delhi',
            destination: 'Jaipur',
            estimatedDistance: 280,
            estimatedFuelPricePerKm: 12,
            estimatedTripPrice: 40000,
            status: 'Completed',
            actualDistance: 290,
            actualFuelCost: 34800,
            revenue: 400000, // Rs. 4L
            endDate: new Date('2024-01-15')
        },
        {
            tripId: 'TRIP-2024-003',
            vehicleId: 3,
            driverId: 3,
            cargoWeight: 800,
            origin: 'Bangalore',
            destination: 'Mysore',
            estimatedDistance: 140,
            estimatedFuelPricePerKm: 8,
            estimatedTripPrice: 15000,
            status: 'Completed',
            actualDistance: 145,
            actualFuelCost: 12000,
            revenue: 120000, // Rs. 1.2L
            endDate: new Date('2024-01-20')
        }
    ];

    for (const t of sampleTrips) {
        await prisma.trip.upsert({
            where: { tripId: t.tripId },
            update: t,
            create: t
        });
    }

    console.log('Trips seeded with revenue');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
