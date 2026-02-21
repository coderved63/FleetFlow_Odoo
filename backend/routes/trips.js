const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

const TripViewers = ['ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'];
const TripManagers = ['ADMIN', 'DISPATCHER'];

// Get all trips
router.get('/', authenticate, authorize(TripViewers), async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            include: {
                vehicle: true,
                driver: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Create a new trip (dispatch)
router.post('/', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        // Expected payload matching frontend new trip form
        const { vehicleId, driverId, cargoWeight, startOdometer, endOdometer, status } = req.body;

        // Ensure vehicle exists and is available
        const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        if (vehicle.status !== 'Available') return res.status(400).json({ error: 'Vehicle is not available for dispatch' });

        // Ensure driver exists
        const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        // Parse cargo weight
        const parsedWeight = parseFloat(cargoWeight);
        if (parsedWeight > vehicle.maxLoadCapacity) {
            return res.status(400).json({ error: `Cargo weight exceeds vehicle max capacity of ${vehicle.maxLoadCapacity}kg` });
        }

        const trip = await prisma.trip.create({
            data: {
                vehicleId: parseInt(vehicleId),
                driverId: parseInt(driverId),
                cargoWeight: parsedWeight,
                status: status || 'Dispatched',
                startOdometer: startOdometer ? parseFloat(startOdometer) : vehicle.odometer,
                endOdometer: endOdometer ? parseFloat(endOdometer) : null,
            }
        });

        // Update vehicle status to On Trip
        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: 'On Trip' }
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to dispatch trip' });
    }
});

// Update trip status (e.g. Completed, Cancelled)
router.patch('/:id/status', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, endOdometer } = req.body;

        const trip = await prisma.trip.update({
            where: { id: parseInt(id) },
            data: {
                status,
                endOdometer: endOdometer ? parseFloat(endOdometer) : undefined
            }
        });

        // If trip is completed or cancelled, make vehicle available again
        if (['Completed', 'Cancelled'].includes(status)) {
            await prisma.vehicle.update({
                where: { id: trip.vehicleId },
                data: {
                    status: 'Available',
                    odometer: endOdometer ? parseFloat(endOdometer) : undefined
                }
            });
        }

        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update trip status' });
    }
});

module.exports = router;
