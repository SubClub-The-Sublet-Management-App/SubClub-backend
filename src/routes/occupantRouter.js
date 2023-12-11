const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
    createOccupant,
    getAllOccupants,
    getOccupantById,
    updateOccupantById,
    deleteOccupant,
} = require('../controllers/occupantController');


// POST localhost:3000/occupants/
router.post('/', authMiddleware, createOccupant);

// GET localhost:3000/occupants/
router.get('/', authMiddleware, getAllOccupants);

// GET localhost:3000/occupants/:id
router.get('/:id', authMiddleware, getOccupantById);

// PUT localhost:3000/occupants/:id
router.patch('/:id', authMiddleware, updateOccupantById);

// DELETE localhost:3000/occupants/:id
router.delete('/:id', authMiddleware, deleteOccupant);



module.exports = router;