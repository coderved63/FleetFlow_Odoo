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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
