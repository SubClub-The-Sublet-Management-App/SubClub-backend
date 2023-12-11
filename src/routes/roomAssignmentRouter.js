// assignm room routers
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const {
    createRoomAssignment,
    getAllRoomAssignments,
    getRoomAssignmentById,
    updateRoomAssignmentById,
    deleteRoomAssignment,
} = require('../controllers/roomAssignmentController');

// POST localhost:3000/room-assignments/
router.post('/', authMiddleware, createRoomAssignment);

// GET localhost:3000/room-assignments/
router.get('/', authMiddleware, getAllRoomAssignments);

// GET localhost:3000/room-assignments/:id
router.get('/:id', authMiddleware, getRoomAssignmentById);

// PUT localhost:3000/room-assignments/:id
router.patch('/:id', authMiddleware, updateRoomAssignmentById);

// DELETE localhost:3000/room-assignments/:id
router.delete('/:id', authMiddleware, deleteRoomAssignment);

module.exports = router;



