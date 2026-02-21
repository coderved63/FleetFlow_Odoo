const bcrypt = require('bcryptjs');
const prisma = require('./client');

async function main() {
    const commonPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const users = [
        { email: 'admin@fleetflow.com', name: 'System Admin', role: 'ADMIN', password: adminPassword },
        { email: 'manager@fleetflow.com', name: 'Fleet Manager', role: 'FLEET_MANAGER', password: commonPassword },
        { email: 'dispatcher@fleetflow.com', name: 'Trip Dispatcher', role: 'DISPATCHER', password: commonPassword },
        { email: 'safety@fleetflow.com', name: 'Safety Officer', role: 'SAFETY_OFFICER', password: commonPassword },
        { email: 'finance@fleetflow.com', name: 'Financial Analyst', role: 'FINANCIAL_ANALYST', password: commonPassword },
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: u,
        });
        console.log(`User created: ${user.email} (${user.role})`);
    }

    console.log('\n--- Seeding Fleet Data ---');

    // Seed Vehicles
    const vehiclesData = [
        { name: 'Bharat Benz 5528', licensePlate: 'MH-12-PQ-1234', maxLoadCapacity: 25000, type: 'TRUCK', odometer: 15600, status: 'Available' },
        { name: 'Tata Ultra T.7', licensePlate: 'MH-14-GH-5678', maxLoadCapacity: 7000, type: 'TRUCK', odometer: 8400, status: 'Available' },
        { name: 'Mahindra Supro', licensePlate: 'MH-43-KL-9012', maxLoadCapacity: 1000, type: 'VAN', odometer: 12000, status: 'Available' },
        { name: 'Eicher Pro 2055', licensePlate: 'DL-01-AX-4321', maxLoadCapacity: 5000, type: 'TRUCK', odometer: 5000, status: 'Available' },
    ];

    for (const v of vehiclesData) {
        await prisma.vehicle.upsert({
            where: { licensePlate: v.licensePlate },
            update: v,
            create: v,
        });
        console.log(`Vehicle created: ${v.name} (${v.licensePlate})`);
    }

    // Seed Drivers and Licenses
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
            where: { id: driversData.indexOf(d) + 1 }, // Simple matching for seed
            update: { name: d.name, status: d.status, licenseExpiry: d.licenseExpiry },
            create: d,
        });
        console.log(`Driver created: ${d.name}`);
    }

    console.log('\n--- Credentials for Testing ---');
    console.log('Admin: admin@fleetflow.com / admin123');
    console.log('Others: [email]@fleetflow.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
