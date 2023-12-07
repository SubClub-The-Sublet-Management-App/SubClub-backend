const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const validateFields = require('../utils/validateFields');

// Desc: Register a new user

async function signup(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate the user's input
        const requiredFields = ['firstName', 'lastName', 'email', 'password'];
        const errorMessage = validateFields(requiredFields, req);

        if (errorMessage) {
            return res.status(400).json({ message: errorMessage });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password is not strong enough' });
        }

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Create a copy of the user object without the password field
        const userObj = user.toObject();
        delete userObj.password;

        // Send the response
        res.status(201).json({ message: 'User registered successfully', userObj });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Registration failed' }); // Send a generic error message
    }
}

module.exports = {
    signup,
};
