const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

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

// CORS Configuration - whitelist specific origins
const corsOptions = {
    origin: function (origin, callback) {
        const whitelist = [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.FRONTEND_URL // Add your production domain
        ].filter(Boolean);

        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser()); // Cookie parser for HTTP-only cookies

// Routes
app.use('/api/auth', require('./features/auth/auth.routes'));
app.use('/api/jobs', require('./features/jobs/job.routes'));
app.use('/api/applications', require('./features/applications/application.routes'));
app.use('/api/profile', require('./features/profile/profile.routes'));
app.use('/api/dashboard', require('./features/dashboard/dashboard.routes'));
app.use('/api/search', require('./features/search/search.routes'));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler Middleware (must be after routes)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // Only send stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
