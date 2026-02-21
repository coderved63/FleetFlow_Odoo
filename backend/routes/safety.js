const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add authMiddleware if available, to verify SAFETY_OFFICER role.
// Assuming a simplified setup for now, or you can import from your auth setup.
// const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// @route   GET /api/safety/drivers
// @desc    Get all drivers with filtering and sorting
router.get('/drivers', async (req, res) => {
  try {
    const { status, availability, search, sortBy } = req.query;

    const whereClause = {};
    if (status) whereClause.dutyStatus = status;
    if (availability) whereClause.availability = availability;
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderByClause = { createdAt: 'desc' };
    if (sortBy === 'safetyScore') {
      orderByClause = { safetyScore: 'asc' }; // Lowest first to highlight risks
    } else if (sortBy === 'expiryDate') {
      orderByClause = { licenseExpiry: 'asc' }; // Earliest first
    }

    // License Expiry Check & Auto-Suspend (Evaluated on read for simplicity)
    const today = new Date();
    
    // Process auto-suspensions before fetching final list
    await prisma.driver.updateMany({
        where: {
            licenseExpiry: { lt: today },
            dutyStatus: { not: 'SUSPENDED' }
        },
        data: {
            dutyStatus: 'SUSPENDED'
        }
    });

    const drivers = await prisma.driver.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });

    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching drivers' });
  }
});

// @route   POST /api/safety/drivers
// @desc    Create a new driver
router.post('/drivers', async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiry } = req.body;

    const newDriver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiry: new Date(licenseExpiry),
        dutyStatus: 'ON_DUTY',
        availability: 'AVAILABLE',
        safetyScore: 100,
        complaints: 0
      },
    });
    res.status(201).json(newDriver);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
        return res.status(400).json({ error: 'License number already exists' });
    }
    res.status(500).json({ error: 'Server error creating driver' });
  }
});

// @route   PUT /api/safety/drivers/:id/status
// @desc    Update driver duty status
router.put('/drivers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { dutyStatus } = req.body; // 'ON_DUTY', 'BREAK', 'SUSPENDED'

    const updatedDriver = await prisma.driver.update({
      where: { id: parseInt(id) },
      data: { dutyStatus },
    });
    res.json(updatedDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

// @route   POST /api/safety/drivers/:id/incidents
// @desc    Log an incident and adjust safety score
router.post('/drivers/:id/incidents', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description } = req.body;
    const driverId = parseInt(id);

    let scoreDeduction = 0;
    if (type === 'LATE') scoreDeduction = 5;
    else if (type === 'COMPLAINT') scoreDeduction = 10;
    else if (type === 'MINOR') scoreDeduction = 15;
    else if (type === 'MAJOR') scoreDeduction = 30;

    // Transaction to create incident and update driver
    const result = await prisma.$transaction(async (tx) => {
      const incident = await tx.driverIncident.create({
        data: {
          driverId,
          type,
          description,
          severityScore: scoreDeduction,
        },
      });

      const driver = await tx.driver.findUnique({ where: { id: driverId } });
      let newScore = driver.safetyScore - scoreDeduction;
      if (newScore < 0) newScore = 0;

      let newStatus = driver.dutyStatus;
      if (newScore < 40) {
          newStatus = 'SUSPENDED';
      }

      let newComplaints = driver.complaints;
      if (type === 'COMPLAINT') {
          newComplaints += 1;
      }

      const updatedDriver = await tx.driver.update({
        where: { id: driverId },
        data: { 
            safetyScore: newScore,
            dutyStatus: newStatus,
            complaints: newComplaints
        },
      });

      return { incident, driver: updatedDriver };
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error logging incident' });
  }
});

// @route   GET /api/safety/drivers/:id/incidents
// @desc    Get incident history for a driver
router.get('/drivers/:id/incidents', async (req, res) => {
  try {
    const { id } = req.params;
    const incidents = await prisma.driverIncident.findMany({
      where: { driverId: parseInt(id) },
      orderBy: { date: 'desc' },
    });
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching incidents' });
  }
});

module.exports = router;
