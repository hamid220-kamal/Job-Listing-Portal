const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    validateToken,
    refreshToken,
} = require('./auth.controller');
const { protect } = require('../../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/validate-token', validateToken);
router.get('/me', protect, getMe);

module.exports = router;
