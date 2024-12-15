const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const alertRoutes = require('./route/alert');
const cronService = require('./services/cornServices');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize cron service
cronService.init();

// Routes
app.use('/api/alerts', alertRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});