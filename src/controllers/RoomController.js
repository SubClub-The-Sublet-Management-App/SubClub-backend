
const Room = require('../models/RoomModel');

// Create a new room
// POST localhost:3000/rooms/
const createRoom = async (req, res) => {
    try {
        // Include the user field in the room data
        const roomData = {
            ...req.body,
            user: req.user._id,
        };

        const newRoom = await Room.create(roomData);
        res.json({
            message: "Successfully created a new room",
            data: newRoom,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a new room",
            error: error.message,
        });
    }
};

// View all rooms
// GET localhost:3000/rooms/
const getAllRooms = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all rooms that belong to the user
        const allRooms = await Room.find({ user: userId });

        res.json({
            message: "Successfully retrieved all rooms",
            data: allRooms,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve rooms",
            error: error.message,
        });
    }
};

// View a room by id
// GET localhost:3000/rooms/:id
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id, user: req.user._id });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({
            message: "Successfully retrieved the room by id",
            data: room,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve the room by id",
            error: error.message,
        });
    }
};

// View a room by name
// GET - localhost:3000/rooms/one/name/Room%1
const getRoomByName = async (req, res) => {
    const { name } = req.params;
    const { _id: userId } = req.user;

    try {
        const room = await Room.findOne({ name, user: userId });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({
            message: "Successfully retrieved the room by name",
            data: room,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({
            message: "Unable to retrieve the room by name",
            error: error.message,
        });
    }
};

// Update a room by id
// UPDATE - localhost:3000/rooms/:id
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({
            message: "Successfully updated the room",
            data: room,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to update the room",
            error: error.message,
        });
    }
};

// Delete a room by id
//DELETE - localhost:3000/rooms/:id
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({
            message: "Successfully deleted the room",
            deletedRoom: room,
        });
    } catch (error) {
        res.status(500).json({
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
