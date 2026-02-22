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

// Filter vehicles by cargo weight
router.get('/filter-vehicles', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        const { cargoWeight } = req.query;
        const weight = parseFloat(cargoWeight);

        const vehicles = await prisma.vehicle.findMany({
            where: {
                maxLoadCapacity: { gte: weight },
                status: 'Available'
            }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter vehicles' });
    }
});

// Filter drivers by vehicle type compatibility
router.get('/filter-drivers', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        const { vehicleType } = req.query;

        const drivers = await prisma.driver.findMany({
            where: {
                license: {
                    vehicleType: vehicleType
                },
                // Safety Officer restrictions
                dutyStatus: 'ON_DUTY',
                availability: 'AVAILABLE',
                licenseExpiry: { gt: new Date() },
                safetyScore: { gte: 40 }
            },
            include: {
                license: true
            }
        });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter drivers' });
    }
});

// Create a new trip (dispatch)
router.post('/', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        const {
            vehicleId,
            driverId,
            cargoWeight,
            origin,
            destination,
            estimatedDistance,
            estimatedFuelPricePerKm,
            estimatedTripPrice,
            status
        } = req.body;

        const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(vehicleId) } });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

        const driver = await prisma.driver.findUnique({ where: { id: parseInt(driverId) } });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        // Safety Officer Validation Rules
        const today = new Date();
        if (driver.dutyStatus !== 'ON_DUTY' || 
            driver.availability !== 'AVAILABLE' || 
            driver.licenseExpiry < today || 
            driver.safetyScore < 40) {
            return res.status(403).json({ error: 'Driver not eligible for assignment' });
        }

        // Generate Unique Trip ID
        const date = new Date();
        const tripCount = await prisma.trip.count();
        const tripId = `TRIP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}-${(tripCount + 1).toString().padStart(3, '0')}`;

        const trip = await prisma.trip.create({
            data: {
                tripId,
                vehicleId: parseInt(vehicleId),
                driverId: parseInt(driverId),
                cargoWeight: parseFloat(cargoWeight),
                origin,
                destination,
                estimatedDistance: parseFloat(estimatedDistance),
                estimatedFuelPricePerKm: parseFloat(estimatedFuelPricePerKm),
                estimatedTripPrice: parseFloat(estimatedTripPrice),
                status: status || 'Dispatched',
                startOdometer: vehicle.odometer,
            }
        });

        // Update vehicle and driver status
        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: 'On Trip' }
        });

        await prisma.driver.update({
            where: { id: parseInt(driverId) },
            data: { availability: 'ON_TRIP' }
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to dispatch trip' });
    }
});

// Complete trip and update calculations
router.patch('/:id/complete', authenticate, authorize(TripManagers), async (req, res) => {
    try {
        const { id } = req.params;
        const { endOdometer, actualFuelCostPerKm, revenue } = req.body;

        const trip = await prisma.trip.findUnique({
            where: { id: parseInt(id) },
            include: { vehicle: true }
        });

        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const startOdometer = trip.startOdometer || trip.vehicle.odometer;
        const actualDistance = parseFloat(endOdometer) - startOdometer;
        const actualFuelCost = actualDistance * parseFloat(actualFuelCostPerKm);

        // Simple calculation for actual trip price
        const actualTripPrice = actualFuelCost * 1.5;

        const updatedTrip = await prisma.trip.update({
            where: { id: parseInt(id) },
            data: {
                status: 'Completed',
                endDate: new Date(),
                endOdometer: parseFloat(endOdometer),
                actualDistance,
                actualFuelCost,
                actualTripPrice,
                revenue: parseFloat(revenue || 0)
            }
        });

        // Update vehicle odometer and status
        await prisma.vehicle.update({
            where: { id: trip.vehicleId },
            data: {
                status: 'Available',
                odometer: parseFloat(endOdometer)
            }
        });

        await prisma.driver.update({
            where: { id: trip.driverId },
            data: { availability: 'AVAILABLE' }
        });

        res.json(updatedTrip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to complete trip' });
    }
});

module.exports = router;
