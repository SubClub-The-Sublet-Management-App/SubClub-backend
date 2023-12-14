const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authMiddleware = async (req, response, next) => {
    // Get token from the header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return response.status(401).json({ message: 'No Authorization header, authorization denied' });
    }
    const token = authHeader.replace('Bearer ', '');

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Find the user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return response.status(401).json({ message: 'User not found, authorization denied' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        response.status(401).json({ message: 'Token is not valid, authorization denied' });
    }
};

module.exports = authMiddleware;