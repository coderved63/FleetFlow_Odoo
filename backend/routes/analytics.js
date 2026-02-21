const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

// Get overall analytics summary
router.get('/summary', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
                trips: { where: { status: 'Completed' } },
                maintenanceLogs: true
            }
        });

        const allVehicles = await prisma.vehicle.findMany();
        const activeVehiclesCount = allVehicles.filter(v => v.status === 'On Trip' || v.status === 'In Use').length;
        const totalVehiclesCount = allVehicles.length;

        let totalFuelCost = 0;
        let totalRevenue = 0;
        let totalMaintenance = 0;
        let totalAcquisition = 0;

        vehicles.forEach(v => {
            totalAcquisition += v.acquisitionCost || 0;
            v.trips.forEach(t => {
                totalFuelCost += t.actualFuelCost || 0;
                totalRevenue += t.revenue || 0; // Use new revenue field
            });
            v.maintenanceLogs.forEach(m => {
                totalMaintenance += m.cost || 0;
            });
        });

        // ROI Formula: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
        let roi = totalAcquisition > 0 ? ((totalRevenue - (totalMaintenance + totalFuelCost)) / totalAcquisition) * 100 : 0;

        // Fix for negative zero display or extremely small negative values appearing as -0.0
        if (Object.is(roi, -0) || (roi < 0 && roi > -0.01)) {
            roi = 0;
        }

        // Utilization Rate: (Active / Total)
        const utilization = totalVehiclesCount > 0 ? Math.round((activeVehiclesCount / totalVehiclesCount) * 100) : 0;

        res.json({
            totalFuelCost,
            roi,
            utilization,
            totalRevenue,
            totalMaintenance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to calculate analytics summary' });
    }
});

// Get financial summary table data (monthly)
router.get('/financial-summary', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            where: { status: 'Completed' },
            select: {
                revenue: true, // Use new revenue field
                actualFuelCost: true,
                endDate: true
            }
        });

        const maintenance = await prisma.maintenanceLog.findMany({
            select: { cost: true, date: true }
        });

        const monthlyData = {};

        trips.forEach(t => {
            const date = new Date(t.endDate || Date.now());
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) monthlyData[month] = { month, revenue: 0, fuelCost: 0, maintenance: 0 };
            monthlyData[month].revenue += t.revenue || 0;
            monthlyData[month].fuelCost += t.actualFuelCost || 0;
        });

        maintenance.forEach(m => {
            const date = new Date(m.date);
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) monthlyData[month] = { month, revenue: 0, fuelCost: 0, maintenance: 0 };
            monthlyData[month].maintenance += m.cost || 0;
        });

        const result = Object.values(monthlyData).map(d => ({
            ...d,
            netProfit: d.revenue - (d.fuelCost + d.maintenance)
        })).sort((a, b) => {
            const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
            return months[a.month] - months[b.month];
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch financial summary' });
    }
});

// Get charts
router.get('/charts', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        const FUEL_PRICE_AVG = 100;

        const trips = await prisma.trip.findMany({
            where: { status: 'Completed' },
            select: { actualDistance: true, actualFuelCost: true, endDate: true }
        });

        const monthlyEfficiency = {};
        trips.forEach(t => {
            const date = new Date(t.endDate || Date.now());
            const month = date.toLocaleString('default', { month: 'short' });
            if (!monthlyEfficiency[month]) monthlyEfficiency[month] = { dist: 0, cost: 0 };
            monthlyEfficiency[month].dist += t.actualDistance || 0;
            monthlyEfficiency[month].cost += t.actualFuelCost || 0;
        });

        const efficiencyTrend = Object.keys(monthlyEfficiency).map(m => ({
            month: m,
            efficiency: monthlyEfficiency[m].cost > 0 ? (monthlyEfficiency[m].dist / (monthlyEfficiency[m].cost / FUEL_PRICE_AVG)).toFixed(2) : 0
        })).sort((a, b) => {
            const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
            return months[a.month] - months[b.month];
        });

        const vehicles = await prisma.vehicle.findMany({
            include: {
                trips: { where: { status: 'Completed' } },
                maintenanceLogs: true
            }
        });

        const vehicleCosts = vehicles.map(v => {
            const fuel = v.trips.reduce((acc, t) => acc + (t.actualFuelCost || 0), 0);
            const maintenance = v.maintenanceLogs.reduce((acc, m) => acc + (m.cost || 0), 0);
            return {
                label: v.licensePlate,
                cost: fuel + maintenance
            };
        }).sort((a, b) => b.cost - a.cost).slice(0, 5);

        res.json({
            efficiencyTrend,
            vehicleCosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch chart data' });
    }
});

module.exports = router;
