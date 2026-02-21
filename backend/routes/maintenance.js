const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

// Fleet Manager and Admin can view and create logs
const MaintenanceRoles = ['ADMIN', 'FLEET_MANAGER'];

// Get all maintenance logs
router.get('/', authenticate, authorize(MaintenanceRoles), async (req, res) => {
    try {
        const logs = await prisma.maintenanceLog.findMany({
            include: {
                vehicle: true
            },
            orderBy: { date: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch maintenance logs' });
    }
});

// Create a new maintenance log
router.post('/', authenticate, authorize(MaintenanceRoles), async (req, res) => {
    try {
        const { vehicleId, serviceType, cost, description, status } = req.body;

        // Ensure vehicle exists
        const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

        const parsedCost = cost ? parseFloat(cost) : 0;

        const log = await prisma.maintenanceLog.create({
            data: {
                vehicleId: parseInt(vehicleId),
                serviceType,
                cost: parsedCost,
                description: description || '',
                date: new Date(),
                status: status || 'Pending'
            }
        });

        // Business Logic: Automatically switch vehicle to IN_SHOP
        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: 'In Shop' }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log maintenance' });
    }
});

module.exports = router;
