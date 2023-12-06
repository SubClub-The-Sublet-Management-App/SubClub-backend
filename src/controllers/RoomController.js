
const Room = require('../models/RoomModel');

// POST localhost:3000/rooms/
const createRoom = async (request, response) => {
    try {
        const newRoom = await Room.create(request.body);
        response.json({
            message: "Successfully created a new room",
            data: newRoom,
        })
    } catch (error) {
        response.status(500).json({
            message: "Unable to create a new room",
            error: error.message,
        })
    }
}


// GET localhost:3000/rooms/
const getAllRooms = async (request, response) => {
    try {
        const allRooms = await Room.find({});
        response.json({
            message: "Successfully retrieved all rooms",
            data: allRooms,
        })
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve all rooms",
            error: error.message,
        })
    }
}



// GET localhost:3000/rooms/:id
const getRoomById = async (request, response) => {
    try {
        const room = await Room.findById(request.params.id);
        response.json({
            message: "Successfully retrieved the room by id",
            data: room,
        })
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve the room by id",
            error: error.message,
        })
    }
}



// GET - localhost:3000/rooms/one/name/Room-1
const getRoomByName = async (request, response) => {
    try {
        const room = await Room.find({name: request.params.name});
        response.json({
            message: "Successfully retrieved the room by name",
            data: room,
        })
    } catch (error) {
        response.status(500).json({
            message: "Unable to retrieve the room by name",
            error: error.message,
        })
    }
}



// UPDATE - localhost:3000/rooms/:id
const updateRoom = async (request, response) => {
    try {
      const room = await Room.findByIdAndUpdate(request.params.id, request.body, { new: true });
      if (!room) return response.status(404).json({ message: 'Room not found' });
      response.status(200).json({ message: 'Room updated', data: room });
    } catch (error) {
      response.status(500).json({ message: 'Error updating room', error: error.message });
    }
  };
  
  //DELETE - localhost:3000/rooms/:id
  const deleteRoom = async (request, response) => {
    try {
      const room = await Room.findByIdAndDelete(request.params.id);
      if (!room) return response.status(404).json({ message: 'Room not found' });
      response.status(200).json({ message: 'Room deleted', data: room });
    } catch (error) {
      response.status(500).json({ message: 'Error deleting room', error: error.message });
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
