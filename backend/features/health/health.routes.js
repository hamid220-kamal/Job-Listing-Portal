const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @desc    Check API and DB health
// @route   GET /api/health
// @access  Public
router.get('/', async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        env: process.env.NODE_ENV,
        checks: {
            database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            jwt_secret: !!process.env.JWT_SECRET ? 'Configured' : 'MISSING',
            mongo_uri: !!process.env.MONGO_URI ? 'Configured' : 'MISSING',
        }
    };

    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
});

module.exports = router;
