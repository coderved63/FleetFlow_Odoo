const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dummyDrivers = [
    {
      name: 'James Carter',
      licenseNumber: 'LIC-001-JC',
      licenseCategory: 'TRUCK',
      licenseExpiry: new Date('2027-06-15'),
      dutyStatus: 'ON_DUTY',
      availability: 'AVAILABLE',
      safetyScore: 95,
      complaints: 0,
      status: 'On Duty',
    },
    {
      name: 'Maria Lopez',
      licenseNumber: 'LIC-002-ML',
      licenseCategory: 'VAN',
      licenseExpiry: new Date('2026-03-10'),   // expiring in ~18 days
      dutyStatus: 'ON_DUTY',
      availability: 'ON_TRIP',
      safetyScore: 78,
      complaints: 1,
      status: 'On Duty',
    },
    {
      name: 'Ahmed Khan',
      licenseNumber: 'LIC-003-AK',
      licenseCategory: 'TRUCK',
      licenseExpiry: new Date('2025-11-01'),   // already expired → auto-suspended
      dutyStatus: 'SUSPENDED',
      availability: 'AVAILABLE',
      safetyScore: 35,
      complaints: 4,
      status: 'Suspended',
    },
    {
      name: 'Susan Wright',
      licenseNumber: 'LIC-004-SW',
      licenseCategory: 'BIKE',
      licenseExpiry: new Date('2028-01-20'),
      dutyStatus: 'BREAK',
      availability: 'AVAILABLE',
      safetyScore: 88,
      complaints: 0,
      status: 'On Duty',
    },
    {
      name: 'David Okafor',
      licenseNumber: 'LIC-005-DO',
      licenseCategory: 'TRUCK',
      licenseExpiry: new Date('2026-02-28'),  // expiring in ~7 days
      dutyStatus: 'ON_DUTY',
      availability: 'AVAILABLE',
      safetyScore: 62,
      complaints: 2,
      status: 'On Duty',
    },
    {
      name: 'Priya Nair',
      licenseNumber: 'LIC-006-PN',
      licenseCategory: 'VAN',
      licenseExpiry: new Date('2027-09-30'),
      dutyStatus: 'ON_DUTY',
      availability: 'AVAILABLE',
      safetyScore: 100,
      complaints: 0,
      status: 'On Duty',
    },
    {
      name: 'Carlos Mendez',
      licenseNumber: 'LIC-007-CM',
      licenseCategory: 'TRUCK',
      licenseExpiry: new Date('2026-04-05'),
      dutyStatus: 'SUSPENDED',
      availability: 'AVAILABLE',
      safetyScore: 55,
      complaints: 3,
      status: 'Suspended',
    },
    {
      name: 'Liu Wei',
      licenseNumber: 'LIC-008-LW',
      licenseCategory: 'BIKE',
      licenseExpiry: new Date('2027-12-01'),
      dutyStatus: 'ON_DUTY',
      availability: 'ON_TRIP',
      safetyScore: 91,
      complaints: 0,
      status: 'On Duty',
    },
  ];

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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
