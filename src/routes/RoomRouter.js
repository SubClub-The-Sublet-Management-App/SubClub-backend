
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
    createRoom, 
    getAllRooms, 
    getRoomById, 
    getRoomByName, 
    updateRoom, 
    deleteRoom 
    } = require('../controllers/roomController');

// POST localhost:3000/rooms/
router.post('/', authMiddleware, createRoom);

// GET localhost:3000/rooms/
router.get('/', authMiddleware, getAllRooms);

// GET localhost:3000/rooms/:id
router.get('/:id', authMiddleware, getRoomById);

// GET localhost:3000/rooms/:name
router.get('/name/:name', authMiddleware, getRoomByName);

// PUT localhost:3000/rooms/:id
router.put('/:id', authMiddleware, updateRoom);

// DELETE localhost:3000/rooms/:id
router.delete('/:id', authMiddleware, deleteRoom);



module.exports = router;