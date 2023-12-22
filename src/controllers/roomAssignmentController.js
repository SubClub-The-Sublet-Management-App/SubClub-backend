const RoomAssignment = require('../models/roomAssignmentModel');
const Room = require('../models/roomModel');
const Occupant = require('../models/occupantModel');

// Create a new room assignment
// POST - localhost:3000/room-assignments/
const createRoomAssignment = async (req, response) => {
    try {
        // Include the user field in the room assignment data
        const roomAssignmentData = {
            ...req.body,
            user: req.user._id,
        };

        const startRequestDate = new Date(roomAssignmentData.startDate);
        const endRequestDate = new Date(roomAssignmentData.endDate);

        // Validate request assignment dates
        if (endRequestDate < startRequestDate){
            return response.status(400).json({ message: 'End Date cannot be before Start Date' });
        }

        // Check on db if room has already been assigned
        const existingRoomAssignment = await RoomAssignment.findOne({ room: roomAssignmentData.room, isActive: true});

        let newRoomAssignment;
        if (existingRoomAssignment) {
            // check the start and end date of the assignment is within the new 
            const assignmentsStartDate = new Date(existingRoomAssignment.startDate);
            const assignmentsEndDate = new Date(existingRoomAssignment.endDate);

            // Function to check if the request date is within the dates already assigned to the room.
            const isWithinRange = (startRequestDate, assignmentsStartDate, assignmentsEndDate) => {
                return startRequestDate >= assignmentsStartDate && startRequestDate <= assignmentsEndDate;
            };

            if (isWithinRange(startRequestDate, assignmentsStartDate, assignmentsEndDate)) {
                // The date is within the range
                return response.status(400).json({ message: 'Room has already been assigned for that date' });
            } else {
                // Create the new room assignment
                newRoomAssignment = await RoomAssignment.create(roomAssignmentData);
            } 
        } else {
            // Create the new room assignment
            newRoomAssignment = await RoomAssignment.create(roomAssignmentData);
        }
        
        // Create a copy of the RoomAssignment object
        let roomAssignmentObj = newRoomAssignment.toObject();

        // Delete the user field from the copy
        delete roomAssignmentObj.user;

        // Send response
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
        // Find all room assignments by user
        const allRoomAssignments = await RoomAssignment.find({ user: req.user._id})
        .select('-user')
        .populate('room', 'monthlyRentalPrice content name')
        .populate('occupant', 'firstName lastName email phoneNumber');

        // Send request response
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
// GET localhost:3000/room-assignments/:id
const getRoomAssignmentById = async (req, response) => {
    try {
        // Find all room assignments by user and id
        const roomAssignment = await RoomAssignment.findOne({ _id: req.params.id, user: req.user._id })
        .select('-user')
        .populate('room', 'monthlyRentalPrice content, name')
        .populate('occupant', 'firstName lastName email phoneNumber');

        // Send request response
        response.status(200).json({
            message: "Successfully retrieved room assignment by id",
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
        // Find room assignment by user and id
        const roomAssignment = await RoomAssignment.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true, setDefaultsOnInsert: true }
        ).select('-user');

        // Error handle for non existing room assignment
        if (!roomAssignment) {
            return response.status(404).json({ message: "Room assignment not found" });
        }

        // Send request respond
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


