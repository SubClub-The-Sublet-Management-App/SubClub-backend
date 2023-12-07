const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} = require('../controllers/UserController');

const {signup, login} = require('../controllers/AuthController');

// USER ROUTES

// GET localhost:3000/users/
router.get('/', getAllUsers);

// GET localhost:3000/users/:id
router.get('/:id', getUserById);

// PUT localhost:3000/users/:id
router.put('/:id', updateUserById);

// DELETE localhost:3000/users/:id
router.delete('/:id', deleteUserById);


// AUTH ROUTES

// POST localhost:3000/users/signup
router.post('/signup', signup);


// POST localhost:3000/users/login
router.post('/login', login);


module.exports = router;
