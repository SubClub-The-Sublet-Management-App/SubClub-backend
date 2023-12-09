const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
} = require('../controllers/userController');

// GET localhost:3000/users/
router.get('/', getAllUsers);

// GET localhost:3000/users/:id
router.get('/:id', getUserById);

// PUT localhost:3000/users/:id
router.put('/:id', updateUserById);

// DELETE localhost:3000/users/:id
router.delete('/:id', deleteUserById);


module.exports = router;
