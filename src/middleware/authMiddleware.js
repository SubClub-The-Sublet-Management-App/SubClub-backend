const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    // Get token from the header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No Authorization header, authorization denied' });
    }
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(decoded);

        // Find the user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid, authorization denied' });
    }
};

module.exports = authMiddleware;