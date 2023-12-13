const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const validateFields = require('../utils/validateFields');
const { comparePassword, generateJwt } = require('../utils/authHelpers'); 


// Create user account
// POST localhost:3000/auth/signup
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


        // Create the new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
        });

        await user.save();

        // Create a copy of the user object without the password field
        const userObj = user.toObject();
        delete userObj.password;

        // Send the response
        res.status(201).json({ message: 'User registered successfully', userObj });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' }); 
    }
}

// Login into user account
// POST localhost:3000/auth/login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate the user's input
        const requiredFields = ['email', 'password'];
        const errorMessage = validateFields(requiredFields, req);

        if (errorMessage) {
            return res.status(400).json({ message: errorMessage });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Check if the password is correct
        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a JWT
        const token = generateJwt(user._id);

        // Send the response
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

module.exports = {
    signup,
    login,
};

