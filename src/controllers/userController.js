// import Express library
const express = require('express');
const User = require('../models/userModel')

// Update user profile
// PATCH localhost:3000/users/profile
const updateProfile = async (req, res) => {
    const updateData = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

// View user profile
// GET localhost:3000/users/profile
const viewProfile = async (req, res) => {
    const updateData = req.body;

    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Successfully retrieved user profile', user });
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve user profile' });
    }
};


// Delete user account
// DELETE localhost:3000/users/delete
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User account not found'});
        }
        
        res.status(200).json({ message: 'Your account has been successfully deleted'});
    } catch (error) {
        res.status(500).json({ 
            message: 'Unable to delete user account',
            error: error.message,
        });
    }
};



module.exports = {
    updateProfile,
    viewProfile,
    deleteAccount
};

