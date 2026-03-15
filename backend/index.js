const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'debug.log');
const log = (msg) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    console.log(msg);
};

log('Backend starting...');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Ensure upload directories exist (handled gracefully for serverless environments)
try {
    const uploadDir = path.join(__dirname, 'uploads');
    const resumeDir = path.join(uploadDir, 'resumes');

    // On serverless environments like Vercel, the filesystem is often read-only
    // We only attempt to create directories if we're not running in a strictly read-only env
    if (!process.env.VERCEL) {
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
    }
} catch (error) {
    console.warn('⚠️ Warning: Could not create upload directories. This might be expected in a serverless environment:', error.message);
}

// Load environment variables
dotenv.config();

// Connect to database
log('Connecting to database...');
connectDB();

const app = express();

log('Middleware setup...');
// Security Middleware
app.use(helmet()); // Security headers

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased for development testing (was 5)
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/login', authLimiter);

// Rate limit token validation to prevent enumeration
const tokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many token validation requests.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth/validate-token', tokenLimiter);

// CORS Configuration - whitelist specific origins
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'https://job-listing-portal-ten-omega.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(mongoSanitize()); // Prevent NoSQL injection attacks (strips $ and . from req.body/query/params)
app.use(cookieParser()); // Cookie parser for HTTP-only cookies

// Database Connection Middleware - Ensures DB is ready before any route is processed
// This is critical when 'bufferCommands: false' is used to prevent race conditions
app.use(async (req, res, next) => {
    try {
        // If connection is already established (1), continue
        // If connection is not established, wait for it
        if (mongoose.connection.readyState !== 1) {
            console.log(`🔄 Database state is ${mongoose.connection.readyState}. Waiting for connection...`);
            await connectDB();
        }

        // If connection is now established, continue
        if (mongoose.connection.readyState === 1) {
            return next();
        }

        res.status(503).json({
            message: 'Database connection is still pending. Please refresh in a moment.'
        });
    } catch (err) {
        console.error('DB Middleware Error:', err);
        next(err);
    }
});

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./features/auth/auth.routes'));
app.use('/api/jobs', require('./features/jobs/job.routes'));
app.use('/api/applications', require('./features/applications/application.routes'));
app.use('/api/profile', require('./features/profile/profile.routes'));
app.use('/api/dashboard', require('./features/dashboard/dashboard.routes'));
app.use('/api/health', require('./features/health/health.routes'));
app.use('/api/search', require('./features/search/search.routes'));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 404 Handler — must come before the error handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handler Middleware (must be last — Express identifies it by 4 params)
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose Bad ID
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Resource not found';
    }

    // Handle Mongoose Duplicate Key
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(statusCode).json({
        message,
        // Only send stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

// Only listen if run directly (not imported as a module for Vercel)
if (require.main === module) {
    log(`Attempting to listen on port ${PORT}...`);
    app.listen(PORT, () => {
        log(`Server running on port ${PORT}`);
        log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

module.exports = app;
