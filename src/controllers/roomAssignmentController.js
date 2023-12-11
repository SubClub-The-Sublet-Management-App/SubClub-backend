const RoomAssignment = require('../models/roomAssignmentModel');

// Create a new room assignment
// POST - localhost:3000/room-assignments/
const createRoomAssignment = async (req, res) => {
    try {
        // Include the user field in the room assignment data
        const roomAssignmentData = {
            ...req.body,
            user: req.user._id,
        };
        console.log(roomAssignmentData);

        // Check on db if room has already been assigned
        const existingRoomAssignment = await RoomAssignment.findOne({ room: roomAssignmentData.room });
        if (existingRoomAssignment) {
            return res.status(400).json({ message: 'Room has already been assigned' });
        }

        // Create the new room assignment
        const newRoomAssignment = await RoomAssignment.create(roomAssignmentData);

        // Create a copy of the RoomAssignment object
        let roomAssignmentObj = newRoomAssignment
        .toObject()
        .populate('room')
        .populate('occupant', 'firstName lastName email phone');

        // Delete the user field from the copy
        delete roomAssignmentObj.user;

        // Send the response
        res.json({
            message: "Successfully created a new room assignment",
            data: roomAssignmentObj,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a new room assignment",
            error: error.message,
        });
    }
};

// View all room assignments
// GET localhost:3000/room-assignments/
const getAllRoomAssignments = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all room assignments that belong to the user
        const allRoomAssignments = await RoomAssignment.find({ user: userId })
        .select('-user')
        .populate('room')
        .populate('occupant', 'firstName lastName email phone');

        res.json({
            message: "Successfully retrieved all room assignments",
            data: allRoomAssignments,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve room assignments",
            error: error.message,
        });
    }
};

// View a room assignment by id
// 
// GET localhost:3000/room-assignments/:id
const getRoomAssignmentById = async (req, res) => {
    try {
        const roomAssignment = await RoomAssignment.findOne({ _id: req.params.id, user: req.user._id })
        .select('-user')
        .populate('room')
        .populate('occupant', 'firstName lastName email phone');
        res.json({
            message: "Successfully retrieved room assignment",
            data: roomAssignment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve room assignment",
            error: error.message,
        });
    }
}

// Update a room assignment by id
// PUT localhost:3000/room-assignments/:id
const updateRoomAssignmentById = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find the room assignment by id
        const roomAssignment = await RoomAssignment.findOne({ _id: req.params.id, user: userId });
        if (!roomAssignment) {
            return res.status(404).json({ message: "Room assignment not found" });
        }
        // Update the room assignment
        Object.assign(roomAssignment, req.body);
        await roomAssignment.save();

        // Send the response
        res.json({
            message: "Successfully updated the room assignment",
            data: roomAssignment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to update the room assignment",
            error: error.message,
        });
    }
};


// Delete a room assignment by id
// DELETE localhost:3000/room-assignments/:id
const deleteRoomAssignmentById = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find the room assignment by id
        const roomAssignment = await RoomAssignment.findOne({ _id: req.params.id, user: userId });
        if (!roomAssignment) {
            return res.status(404).json({ message: "Room assignment not found" });
        }

        // Delete the room assignment
        await roomAssignment.remove();

        // Send the response
        res.json({
            message: "Successfully deleted the room assignment",
            data: roomAssignment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete the room assignment",
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
    deleteRoomAssignmentById,
};


