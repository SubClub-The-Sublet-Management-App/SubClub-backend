const RoomAssignment = require('../models/roomAssignmentModel');
const Room = require('../models/roomModel');

// Create a new room assignment
// POST - localhost:3000/room-assignments/
const createRoomAssignment = async (req, response) => {
    try {
        // Include the user field in the room assignment data
        const roomAssignmentData = {
            ...req.body,
            user: req.user._id,
        };

        // Check on db if room has already been assigned
        const existingRoomAssignment = await RoomAssignment.findOne({ room: roomAssignmentData.room, isActive: true});
        if (existingRoomAssignment) {
            return response.status(400).json({ message: 'Room has already been assigned' });
        }

        // Create the new room assignment
        const newRoomAssignment = await RoomAssignment.create(roomAssignmentData);

        // Create a copy of the RoomAssignment object
        let roomAssignmentObj = newRoomAssignment.toObject();

        // Delete the user field from the copy
        delete roomAssignmentObj.user;

        // Send the response
        response.status(201).json({
            message: "Successfully created a new room assignment",
            data: roomAssignmentObj,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to create a new room assignment",
            error: error.message,
        });
    }
};

// View all room assignments
// GET localhost:3000/room-assignments/
const getAllRoomAssignments = async (req, response) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all room assignments that belong to the user
        const allRoomAssignments = await RoomAssignment.find({ user: userId })
        .select('-user')
        .populate('room', 'monthlyRentalPrice content')
        .populate('occupant', 'firstName lastName email phone');

        response.status(200).json({
            message: "Successfully retrieved all room assignments",
            data: allRoomAssignments,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve room assignments",
            error: error.message,
        });
    }
};

// View a room assignment by id
// 
// GET localhost:3000/room-assignments/:id
const getRoomAssignmentById = async (req, response) => {
    try {
        const roomAssignment = await RoomAssignment.findOne({ _id: req.params.id, user: req.user._id })
        .select('-user')
        .populate('room', 'monthlyRentalPrice content')
        .populate('occupant', 'firstName lastName email phone');
        response.status(200).json({
            message: "Successfully retrieved room assignment",
            data: roomAssignment,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve room assignment",
            error: error.message,
        });
    }
}

// Update a room assignment by id
// PUT localhost:3000/room-assignments/:id
const updateRoomAssignmentById = async (req, response) => {
    try {
        const roomAssignment = await RoomAssignment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true, setDefaultsOnInsert: true }
        ).select('-user');

        if (!roomAssignment) {
            return response.status(404).json({ message: "Room assignment not found" });
        }

        response.status(200).json({
            message: "Successfully updated the room assignment",
            data: roomAssignment,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to update the room assignment",
            error: error.message,
        });
    }
};


// Export the controller functions
module.exports = {
    createRoomAssignment,
    getAllRoomAssignments,
    getRoomAssignmentById,
    updateRoomAssignmentById,
};


