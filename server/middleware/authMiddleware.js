const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // For dummy auth, we just assume it's valid if present
            // and assign a dummy user
            req.user = {
                id: 'dummy-user-id',
                name: 'Dummy User',
                email: 'dummy@example.com',
                role: 'candidate' // Default
            };

            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
