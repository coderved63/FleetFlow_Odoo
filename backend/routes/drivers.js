const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

// Roles allowed to view drivers
const Viewers = ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER'];
// Roles allowed to manage drivers
const Managers = ['ADMIN', 'SAFETY_OFFICER'];

// Get all drivers
router.get('/', authenticate, authorize(Viewers), async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(drivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
});

// Create a new driver
router.post('/', authenticate, authorize(Managers), async (req, res) => {
    try {
        const { name, licenseExpiry, status } = req.body;

        const driver = await prisma.driver.create({
            data: {
                name,
                licenseExpiry: new Date(licenseExpiry),
                status: status || 'On Duty'
            }
        });
        res.status(201).json(driver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create driver' });
    }
});

// Update driver status
router.patch('/:id/status', authenticate, authorize(Managers), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const driver = await prisma.driver.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(driver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update driver status' });
    }
});

module.exports = router;
