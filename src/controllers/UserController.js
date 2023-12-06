// import Express library
const express = require('express');
const { comparePassword, generateJwt } = require('../utils/userAuthVerifier');
const User = require('../models/UserModel')

// Create a new user
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });
    // Create a copy of the user object and delete the password from it
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
        message: "Successfully created a new user",
        data: userResponse,
    });
    } catch (error) {
    res.status(500).json({
        message: "Unable to create a new user",
        error: error.message,
    });
    }
};
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch users",
            error: error.message,
        });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve user",
            error: error.message,
        });
    }
};

// Update a user by ID
const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: "Unable to update user",
            error: error.message,
        });
    }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).select('-password');
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            message: 'User deleted successfully',
            deletedUser: deletedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete user",
            error: error.message,
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};

