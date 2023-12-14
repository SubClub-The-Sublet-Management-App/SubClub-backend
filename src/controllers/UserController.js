// import Express library
const express = require('express');
const User = require('../models/userModel')

// Get all users
const getAllUsers = async (req, response) => {
    try {
        const users = await User.find().select('-password');
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({
            message: "Unable to fetch users",
            error: error.message,
        });
    }
};

// Get a user by ID
const getUserById = async (req, response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }
        response.status(200).json(user);
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve user",
            error: error.message,
        });
    }
};

// Update a user by ID
const updateUserById = async (req, response) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!updatedUser) {
            return response.status(404).json({ message: 'User not found' });
        }
        response.status(200).json(updatedUser);
    } catch (error) {
        response.status(500).json({
            message: "Unable to update user",
            error: error.message,
        });
    }
};

// Delete a user by ID
const deleteUserById = async (req, response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).select('-password');
        if (!deletedUser) {
            return response.status(404).json({ message: 'User not found' });
        }
        response.status(200).json({ 
            message: 'User deleted successfully',
            deletedUser: deletedUser
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to delete user",
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};

