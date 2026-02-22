const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const commonPassword = await bcrypt.hash('password123', 10);

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

<<<<<<< HEAD
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
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));

    const tripData = {
      tripId: `TRIP-2024-${tripCounter.toString().padStart(4, '0')}`,
      vehicleId: vehicle.id,
      driverId: driver.id,
      cargoWeight: vehicle.maxLoadCapacity * (0.5 + Math.random() * 0.5),
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
        cost: liters * 95,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      }
    });
  }
  console.log(`Seeded 30 Fuel Logs`);

  console.log('--- SEEDING COMPLETE! ---');
  console.log('\n--- Credentials for Testing ---');
  console.log('Admin: admin@fleetflow.com / admin123');
  console.log('Others: [email]@fleetflow.com / password123');
=======
  console.log('🌱 Seeding dummy drivers...');
  for (const driver of dummyDrivers) {
    await prisma.driver.upsert({
      where: { licenseNumber: driver.licenseNumber },
      update: driver,
      create: driver,
    });
    console.log(`  ✔ ${driver.name}`);
  }
  console.log('✅ Done!');
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
        console.log(`User created: ${u.email} (${u.role})`);
    }

    console.log('\n--- Seeding Fleet Data ---');

    const vehiclesData = [
        { name: 'Bharat Benz 5528', licensePlate: 'MH-12-PQ-1234', maxLoadCapacity: 25000, type: 'TRUCK', odometer: 15600, status: 'Available', acquisitionCost: 5000000 },
        { name: 'Tata Ultra T.7', licensePlate: 'MH-14-GH-5678', maxLoadCapacity: 7000, type: 'TRUCK', odometer: 8400, status: 'Available', acquisitionCost: 2500000 },
        { name: 'Mahindra Supro', licensePlate: 'MH-43-KL-9012', maxLoadCapacity: 1000, type: 'VAN', odometer: 12000, status: 'Available', acquisitionCost: 800000 },
        { name: 'Eicher Pro 2055', licensePlate: 'DL-01-AX-4321', maxLoadCapacity: 5000, type: 'TRUCK', odometer: 5000, status: 'Available', acquisitionCost: 2000000 },
    ];

    for (const v of vehiclesData) {
        await prisma.vehicle.upsert({
            where: { licensePlate: v.licensePlate },
            update: v,
            create: v,
        });
        console.log(`Vehicle created: ${v.name} (${v.licensePlate})`);
    }

    const driversData = [
        {
            name: 'Rajesh Kumar',
            licenseExpiry: new Date('2028-12-31'),
            status: 'On Duty',
            license: {
                create: {
                    fullName: 'Rajesh Kumar',
                    licenseNo: 'DL-MH12-2020-001',
                    vehicleType: 'TRUCK',
                    expiryDate: new Date('2028-12-31'),
                    status: 'ON_DUTY'
                }
            }
        },
        {
            name: 'Suresh Patil',
            licenseExpiry: new Date('2027-06-15'),
            status: 'On Duty',
            license: {
                create: {
                    fullName: 'Suresh Patil',
                    licenseNo: 'DL-MH14-2021-002',
                    vehicleType: 'TRUCK',
                    expiryDate: new Date('2027-06-15'),
                    status: 'ON_DUTY'
                }
            }
        },
        {
            name: 'Amit Sharma',
            licenseExpiry: new Date('2029-01-10'),
            status: 'On Duty',
            license: {
                create: {
                    fullName: 'Amit Sharma',
                    licenseNo: 'DL-MH43-2022-003',
                    vehicleType: 'VAN',
                    expiryDate: new Date('2029-01-10'),
                    status: 'ON_DUTY'
                }
            }
        }
    ];

    for (const d of driversData) {
        await prisma.driver.upsert({
            where: { id: driversData.indexOf(d) + 1 },
            update: { name: d.name, status: d.status, licenseExpiry: d.licenseExpiry },
            create: d,
        });
        console.log(`Driver created: ${d.name}`);
    }

    console.log('\n--- Seeding Sample Trips ---');
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
            estimatedTripPrice: 2000,
            status: 'Completed',
            actualDistance: 160,
            actualFuelCost: 1600
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
            estimatedTripPrice: 4000,
            status: 'Completed',
            actualDistance: 290,
            actualFuelCost: 3480
        }
    ];

    for (const t of sampleTrips) {
        await prisma.trip.upsert({
            where: { tripId: t.tripId },
            update: t,
            create: t
        });
        console.log(`Trip created: ${t.tripId}`);
    }

    console.log('\n--- Credentials for Testing ---');
    console.log('Admin: admin@fleetflow.com / admin123');
    console.log('Others: [email]@fleetflow.com / password123');
>>>>>>> ebe73cf122fbf8b6678744ed30bb2f2677c31cfa
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
