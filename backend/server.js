const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FleetFlow Backend is running perfectly!' });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
