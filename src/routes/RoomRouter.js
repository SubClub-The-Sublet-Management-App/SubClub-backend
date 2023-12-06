
const express = require('express');
const router = express.Router();

const { createRoom, getAllRooms, getRoomById, getRoomByName, updateRoom, deleteRoom } = require('../controllers/RoomController');

// POST localhost:3000/rooms/
router.post('/', createRoom);

// GET localhost:3000/rooms/
router.get('/', getAllRooms);

// GET localhost:3000/rooms/:id
router.get('/:id', getRoomById);

// PUT localhost:3000/rooms/:id
router.put('/:id', updateRoom);

// DELETE localhost:3000/rooms/:id
router.delete('/:id', deleteRoom);

module.exports = router;