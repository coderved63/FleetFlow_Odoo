const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../prisma/client');
const router = express.Router();

// Get all logged expenses
router.get('/', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Get completed and unlogged trips for selection
router.get('/pending-trips', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        // Find trips that don't have an entry in the Expense table
        const loggedExpenses = await prisma.expense.findMany({
            select: { tripId: true }
        });
        const loggedTripIds = loggedExpenses.map(e => e.tripId);

        const trips = await prisma.trip.findMany({
            where: {
                status: 'Completed',
                NOT: {
                    tripId: { in: loggedTripIds }
                }
            },
            include: {
                driver: true
            }
        });
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending trips' });
    }
});

// Log a new expense
router.post('/', authenticate, authorize(['ADMIN', 'FINANCIAL_ANALYST']), async (req, res) => {
    try {
        const { tripId, driver, distance, fuelCost, miscExpense } = req.body;

        if (!tripId) {
            return res.status(400).json({ error: 'Trip ID is required' });
        }

        // Create the expense record
        const expense = await prisma.expense.create({
            data: {
                tripId,
                driver,
                distance: parseFloat(distance || 0),
                fuelCost: parseFloat(fuelCost),
                miscExpense: parseFloat(miscExpense || 0)
            }
        });

        // NOTE: We don't update the Trip table status as per strict non-modification rules.
        // Status is derived by checking existence in the Expense table.

        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Expense already logged for this trip' });
        }
        res.status(500).json({ error: 'Failed to log expense' });
    }
});

module.exports = router;
