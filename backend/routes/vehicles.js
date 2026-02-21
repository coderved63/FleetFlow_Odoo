const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

// Allow Admin, Fleet Manager, and Dispatcher to view vehicles
const Viewers = ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER'];
// Allow only Admin and Fleet Manager to create vehicles
const Managers = ['ADMIN', 'FLEET_MANAGER'];

// Get all vehicles
router.get('/', authenticate, authorize(Viewers), async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});

// Create a new vehicle
router.post('/', authenticate, authorize(Managers), async (req, res) => {
    try {
        const { licensePlate, name, maxLoadCapacity, acquisitionCost, type, odometer, status } = req.body;

        // Basic validation
        if (!licensePlate || !name) {
            return res.status(400).json({ error: 'License plate and name are required' });
        }
        const vehicle = await prisma.vehicle.create({
            data: {
                name,
                licensePlate,
                type,
                maxLoadCapacity: parseFloat(maxLoadCapacity),
                acquisitionCost: acquisitionCost ? parseFloat(acquisitionCost) : 0,
                odometer: odometer ? parseFloat(odometer) : 0,
                status: status || 'Available'
            }
        });
        res.status(201).json(vehicle);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'License plate already exists' });
        }
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});

// Update vehicle status
router.patch('/:id/status', authenticate, authorize(Managers), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const vehicle = await prisma.vehicle.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update vehicle status' });
    }
});

module.exports = router;
