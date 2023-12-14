const Room = require('../models/roomModel');

// Create a new room
// POST localhost:3000/rooms/
const createRoom = async (req, response) => {
    try {
        // Include the user field in the room data
        const roomData = {
            ...req.body,
            user: req.user._id,
        };

        // Create the new room
        const newRoom = await Room.create(roomData);

        // Create a copy of the newRoom object
        let roomObj = newRoom.toObject();

        // Delete the user field from the copy
        delete roomObj.user;

        // Send the response
        response.status(201).json({
            message: "Successfully created a new room",
            data: roomObj,
        });

    } catch (error) {
        response.status(500).json({
            message: "Unable to create a new room",
            error: error.message,
        });
    }
};

// View all rooms
// GET localhost:3000/rooms/
const getAllRooms = async (req, response) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all rooms that belong to the user
        const allRooms = await Room.find({ user: userId }).select('-user');

        response.status(200).json({
            message: "Successfully retrieved all rooms",
            data: allRooms,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve rooms",
            error: error.message,
        });
    }
};

// View a room by id
// GET localhost:3000/rooms/:id
const getRoomById = async (req, response) => {
    try {
        const room = await Room.findOne({ _id: req.params.id, user: req.user._id }).select('-user');
        if (!room) {
            return response.status(404).json({ message: "Room not found" });
        }

        response.status(200).json({
            message: "Successfully retrieved the room by id",
            data: room,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve the room by id",
            error: error.message,
        });
    }
};

// View a room by name
// GET - localhost:3000/rooms/one/name/room-1
const getRoomByName = async (req, response) => {
    const { name } = req.params;
    const { _id: userId } = req.user;

    try {
        const room = await Room.findOne({ name, user: userId }).select('-user');

        if (!room) {
            return response.status(404).json({ message: "Room not found" });
        }

        response.status(200).json({
            message: "Successfully retrieved the room by name",
            data: room,
        });
    } catch (error) {

        response.status(500).json({
            message: "Unable to retrieve the room by name",
            error: error.message,
        });
    }
};

// Update a room by id
// UPDATE - localhost:3000/rooms/:id
const updateRoom = async (req, response) => {
    try {
        // Find the room by id and user id and update it
        const room = await Room.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, req.body, { new: true }).select('-user');
        if (!room) {
            return response.status(404).json({ message: "Room not found" });
        }
        response.status(200).json({
            message: "Successfully updated the room",
            data: room,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to update the room",
            error: error.message,
        });
    }
};

// Delete a room by id
//DELETE - localhost:3000/rooms/:id
const deleteRoom = async (req, response) => {
    try {
        const room = await Room.findOneAndDelete({ _id: req.params.id, user: req.user._id }).select('-user');
        if (!room) {
            return response.status(404).json({ message: "Room not found" });
        }
        response.status(200).json({
            message: "Successfully deleted the room",
            data: room,
        });
    } catch (error) {
        response.status(500).json({
            message: "Unable to delete the room",
            error: error.message,
        });
    }
};
  
module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    getRoomByName,
    updateRoom,
    deleteRoom,
};
