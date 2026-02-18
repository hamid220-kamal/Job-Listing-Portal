const jwt = require('jsonwebtoken');
const User = require('./user.model');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Password strength validation
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
        return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character';
    }
    return null;
};

// Input sanitization - prevent NoSQL injection
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    return input;
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // 7 days for better security
    });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, role } = req.body;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email)?.toLowerCase();

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
    }

    // Password strength validation
    const passwordError = validatePassword(password);
    if (passwordError) {
        res.status(400);
        throw new Error(passwordError);
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Validate role
    if (role && !['candidate', 'employer'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'candidate',
    });

    if (user) {
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    // Sanitize input
    email = sanitizeInput(email)?.toLowerCase();

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
