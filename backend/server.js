const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const vehicleRoutes = require('./routes/vehicles');
const driverRoutes = require('./routes/drivers');
const tripRoutes = require('./routes/trips');
const maintenanceRoutes = require('./routes/maintenance');
const safetyRoutes = require('./routes/safety');
<<<<<<< HEAD
const expenseRoutes = require('./routes/expenses');
const dashboardRoutes = require('./routes/dashboard');
=======
>>>>>>> ebe73cf122fbf8b6678744ed30bb2f2677c31cfa

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/expenses', expenseRoutes);
<<<<<<< HEAD
app.use('/api/dashboard', dashboardRoutes);
=======
>>>>>>> ebe73cf122fbf8b6678744ed30bb2f2677c31cfa

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FleetFlow Backend is running perfectly!' });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
