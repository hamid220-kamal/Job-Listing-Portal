const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../features/auth/user.model');
const axios = require('axios');

// Deployed Backend URL for Remote Verification
const AUTH_SERVER_URL = 'https://job-listing-portal-psi-nine.vercel.app/api/auth/validate-token';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // MODE 1: ADMIN (Has Secret Key)
            if (process.env.JWT_SECRET) {
                // Verify token locally
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');

                if (!req.user) {
                    res.status(401);
                    throw new Error('User not found');
                }
            }
            // MODE 2: COLLABORATOR (No Secret Key)
            else {
                console.log('⚡ Using Remote Auth Verification...');
                try {
                    const response = await axios.post(AUTH_SERVER_URL, { token });

                    if (response.data.valid) {
                        // We construct a minimal user object from what the Auth Server returned
                        // Note: This user might NOT exist in the local DB yet if they haven't synced/seeded
                        req.user = response.data.user;

                        // Optional: Check if user exists locally, if not, maybe create a stub?
                        // For now, let's assume specific features might fail if user isn't in local DB,
                        // but Auth passes.
                    } else {
                        throw new Error('Invalid Token');
                    }
                } catch (remoteError) {
                    console.error('Remote Auth Failed:', remoteError.message);
                    res.status(401);
                    throw new Error('Not authorized (Remote Verification Failed)');
                }
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
