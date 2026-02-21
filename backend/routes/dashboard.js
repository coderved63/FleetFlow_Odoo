const express = require('express');
const { authenticate } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const [
            activeTripsCount,
            inShopCount,
            pendingMaintenanceCount,
            totalVehicles,
            activeTripsList,
            recentTrips
        ] = await Promise.all([
            prisma.trip.count({ where: { status: 'Dispatched' } }),
            prisma.vehicle.count({ where: { status: 'In Shop' } }),
            prisma.maintenanceLog.count({ where: { status: 'Pending' } }),
            prisma.vehicle.count({ where: { status: { in: ['Available', 'On Trip'] } } }),
            prisma.trip.findMany({
                where: { status: 'Dispatched' },
                select: { cargoWeight: true, estimatedTripPrice: true }
            }),
            prisma.trip.findMany({
                take: 6,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: true, driver: true }
            })
        ]);

        const totalCargoWeight = activeTripsList.reduce((sum, trip) => sum + trip.cargoWeight, 0);
        const totalCargoValue = activeTripsList.reduce((sum, trip) => sum + trip.estimatedTripPrice, 0);

        const utilizationRate = totalVehicles > 0
            ? Math.round((activeTripsCount / totalVehicles) * 100)
            : 0;

        res.json({
            activeFleet: activeTripsCount,
            vehiclesInShop: inShopCount,
            utilizationRate: utilizationRate,
            maintenanceAlerts: pendingMaintenanceCount,
            pendingCargoWeight: totalCargoWeight,
            pendingCargoValue: totalCargoValue,
            recentTrips: recentTrips
        });
    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
});

module.exports = router;
