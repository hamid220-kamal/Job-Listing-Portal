// Dummy Auth Controller with Hardcoded Data

// Generate JWT (Modified to not need env secret if preferred, or keep simplistic)
const generateToken = (id) => {
    // Determine if we want to keep using jsonwebtoken or just return a dummy string
    // For simplicity and to remove .env dependency completely, let's use a dummy token
    return `dummy-token-for-user-${id}`;
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    // Simulate success
    const user = {
        _id: 'dummy-id-' + Date.now(),
        name,
        email,
        role: role || 'candidate',
    };

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Simulate login for any user or specific dummy user
    // Let's allow any login for now as requested
    const user = {
        _id: 'dummy-login-id-123',
        name: 'Dummy User',
        email: email,
        role: 'candidate', // Default role
    };

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by middleware
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
