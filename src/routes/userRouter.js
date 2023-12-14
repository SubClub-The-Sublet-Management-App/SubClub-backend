const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    updateProfile,
    viewProfile,
    deleteAccount
} = require('../controllers/userController');

// PATCH localhost:3000/users/profile/
router.patch('/profile', authMiddleware, updateProfile);

// GET localhost:3000/users/profile/
router.get('/profile', authMiddleware, viewProfile);

// DELETE localhost:3000/users/delete/
router.delete('/delete', authMiddleware, deleteAccount);

module.exports = router;