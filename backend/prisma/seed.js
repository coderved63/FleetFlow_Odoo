const bcrypt = require('bcryptjs');
const prisma = require('./client');

async function main() {
    const commonPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    // --- 1. SEED USERS ---
    console.log('--- 1. Seeding Users ---');
    const users = [
        { email: 'admin@fleetflow.com', name: 'System Admin', role: 'ADMIN', password: adminPassword },
        { email: 'manager@fleetflow.com', name: 'Fleet Manager', role: 'FLEET_MANAGER', password: commonPassword },
        { email: 'dispatcher@fleetflow.com', name: 'Trip Dispatcher', role: 'DISPATCHER', password: commonPassword },
        { email: 'safety@fleetflow.com', name: 'Safety Officer', role: 'SAFETY_OFFICER', password: commonPassword },
        { email: 'finance@fleetflow.com', name: 'Financial Analyst', role: 'FINANCIAL_ANALYST', password: commonPassword },
        { email: 'manager2@fleetflow.com', name: 'Regional Manager', role: 'FLEET_MANAGER', password: commonPassword },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
    }
    console.log(`Seeded ${users.length} Users`);

    // --- 2. SEED VEHICLES ---
    console.log('--- 2. Seeding Vehicles ---');
    const vehicleTypes = ['TRUCK', 'TRUCK', 'VAN', 'VAN', 'TRUCK', 'BIKE', 'TRUCK'];
    const statuses = ['Available', 'On Trip', 'In Shop', 'Out of Service'];
    const vehiclesData = [];

    for (let i = 1; i <= 25; i++) {
        const type = vehicleTypes[i % vehicleTypes.length];
        const capacity = type === 'TRUCK' ? 15000 + (i * 1000) : type === 'VAN' ? 2000 + (i * 100) : 100;
        const cost = type === 'TRUCK' ? 4000000 + (i * 50000) : type === 'VAN' ? 800000 + (i * 10000) : 80000;

        vehiclesData.push({
            name: `Fleet Unit ${i.toString().padStart(3, '0')} (${type})`,
            licensePlate: `MH-${(10 + i).toString().padStart(2, '0')}-PK-${(1000 + i)}`,
            maxLoadCapacity: capacity,
            acquisitionCost: cost,
            type: type,
            odometer: 5000 + (Math.random() * 50000),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }

    const createdVehicles = [];
    for (const v of vehiclesData) {
        const vehicle = await prisma.vehicle.upsert({
            where: { licensePlate: v.licensePlate },
            update: v,
            create: v,
        });
        createdVehicles.push(vehicle);
    }
    console.log(`Seeded ${createdVehicles.length} Vehicles`);

    // --- 3. SEED DRIVERS & LICENSES ---
    console.log('--- 3. Seeding Drivers ---');
    const driverNames = ['Rajesh', 'Suresh', 'Amit', 'Vikram', 'Anil', 'Sunil', 'Prakash', 'Mahesh', 'Ramesh', 'Kiran', 'Rahul', 'Rohit', 'Sachin', 'Virat', 'Dhoni'];
    const createdDrivers = [];

    for (let i = 0; i < driverNames.length; i++) {
        const name = `${driverNames[i]} Kumar`;
        const vType = i % 3 === 0 ? 'VAN' : (i % 5 === 0 ? 'BIKE' : 'TRUCK');
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 2 + Math.floor(Math.random() * 5));

        const driver = await prisma.driver.create({
            data: {
                name: name,
                status: Math.random() > 0.2 ? 'On Duty' : 'Off Duty',
                licenseExpiry: expiry,
                license: {
                    create: {
                        fullName: name,
                        licenseNo: `DL-MH-${2020 + (i % 4)}-${1000 + i}`,
                        vehicleType: vType,
                        expiryDate: expiry,
                        status: 'ON_DUTY'
                    }
                }
            }
        });
        createdDrivers.push(driver);
    }
    console.log(`Seeded ${createdDrivers.length} Drivers & Licenses`);

    // --- 4. SEED TRIPS & EXPENSES ---
    console.log('--- 4. Seeding Trips & Expenses ---');
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Surat'];
    let tripCounter = 1;

    for (let i = 0; i < 40; i++) {
        const isCompleted = Math.random() > 0.3; // 70% completed, 30% ongoing

        const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
        const driver = createdDrivers[Math.floor(Math.random() * createdDrivers.length)];

        const origin = cities[Math.floor(Math.random() * cities.length)];
        let dest = cities[Math.floor(Math.random() * cities.length)];
        while (dest === origin) dest = cities[Math.floor(Math.random() * cities.length)];

        const estDistance = 200 + Math.floor(Math.random() * 800);
        const fuelPrice = 14 + (Math.random() * 4); // ₹14-18 / km

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30)); // Started sometime in last 30 days

        const tripData = {
            tripId: `TRIP-2024-${tripCounter.toString().padStart(4, '0')}`,
            vehicleId: vehicle.id,
            driverId: driver.id,
            cargoWeight: vehicle.maxLoadCapacity * (0.5 + Math.random() * 0.5), // 50-100% capacity
            origin: origin,
            destination: dest,
            estimatedDistance: estDistance,
            estimatedFuelPricePerKm: fuelPrice,
            estimatedTripPrice: estDistance * fuelPrice * 1.5,
            status: isCompleted ? 'Completed' : 'Dispatched',
            startDate: startDate,
            logged: isCompleted && Math.random() > 0.5 ? 'LOGGED' : 'NOT_LOGGED',
            startOdometer: vehicle.odometer - estDistance - (isCompleted ? 50 : 0)
        };

        if (isCompleted) {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1 + Math.floor(Math.random() * 3));

            tripData.endDate = endDate;
            tripData.endOdometer = tripData.startOdometer + estDistance + Math.floor(Math.random() * 20);
            tripData.actualDistance = tripData.endOdometer - tripData.startOdometer;
            tripData.actualFuelCost = tripData.actualDistance * fuelPrice;
            tripData.actualTripPrice = tripData.actualFuelCost * 1.5;

            // Log corresponding expense if logged status is true
            if (tripData.logged === 'LOGGED') {
                await prisma.expense.create({
                    data: {
                        tripId: tripData.tripId,
                        driver: driver.name,
                        distance: tripData.actualDistance,
                        fuelCost: tripData.actualFuelCost,
                        miscExpense: Math.floor(Math.random() * 2000),
                        createdAt: endDate
                    }
                });
            }
        }

        await prisma.trip.create({ data: tripData });
        tripCounter++;
    }
    console.log(`Seeded 40 Trips (and associated Expenses)`);

    // --- 5. SEED MAINTENANCE LOGS ---
    console.log('--- 5. Seeding Maintenance Logs ---');
    const serviceTypes = ['Oil Change', 'Tire Replacement', 'Brake Inspection', 'Engine Overhaul', 'General Servicing'];
    for (let i = 0; i < 20; i++) {
        const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60));

        await prisma.maintenanceLog.create({
            data: {
                vehicleId: vehicle.id,
                serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
                description: 'Routine maintenance check and parts replacement.',
                cost: 5000 + Math.floor(Math.random() * 15000),
                status: Math.random() > 0.2 ? 'Completed' : 'Pending',
                date: date
            }
        });
    }
    console.log(`Seeded 20 Maintenance Logs`);

    // --- 6. SEED FUEL LOGS ---
    console.log('--- 6. Seeding Fuel Logs ---');
    for (let i = 0; i < 30; i++) {
        const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
        const liters = 40 + Math.floor(Math.random() * 100);
        await prisma.fuelLog.create({
            data: {
                vehicleId: vehicle.id,
                liters: liters,
                cost: liters * 95, // Approx ₹95/liter
                date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
            }
        });
    }
    console.log(`Seeded 30 Fuel Logs`);

    console.log('--- SEEDING COMPLETE! ---');
    console.log('\n--- Credentials for Testing ---');
    console.log('Admin: admin@fleetflow.com / admin123');
    console.log('Others: [email]@fleetflow.com / password123');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
