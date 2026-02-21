const bcrypt = require('bcryptjs');
const prisma = require('./client');

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@fleetflow.com' },
        update: {},
        create: {
            email: 'admin@fleetflow.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN',
        },
    });

    console.log('Dummy Admin created: ', admin.email, ' / admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
