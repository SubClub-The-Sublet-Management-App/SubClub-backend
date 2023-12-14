const Occupant = require('../models/occupantModel');

// Create a new occupant
// POST localhost:3000/occupant/
const createOccupant = async (req, res) => {
    try {
        // Include the user field in the occupants data
        const occupantData = {
            ...req.body,
            user: req.user._id,
        };

        // Check if occupant already exist by the email
        const existingOccupant = await Occupant.findOne({ email: occupantData.email });
        if (existingOccupant) {
            return res.status(400).json({ message: 'Occupant already exist' });
        }
        
        // Create the new occupant
        const newOccupant = await Occupant.create(occupantData);

        // Create a copy of the Occupant object
        let occupantObj = newOccupant.toObject();

        // Delete the user field from the copy
        delete occupantObj.user;

        // Send the response
        res.status(201).json({
            message: "Successfully created a new Occupant",
            data: occupantObj,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a new Occupant",
            error: error.message,
        });
    }
};

// View all Occupants
// GET localhost:3000/occupants/
const getAllOccupants = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all Occupants that belong to the user
        const allOccupants = await Occupant.find({ user: userId }).select('-user');

        res.status(200).json({
            message: "Successfully retrieved all Occupants",
            data: allOccupants,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve Occupants",
            error: error.message,
        });
    }
};

// View a occupant by id
// GET localhost:3000/occupants/:id
const getOccupantById = async (req, res) => {
    try {
        const occupant = await Occupant.findOne({ _id: req.params.id, user: req.user._id }).select('-user');
        if (!occupant) {
            return res.status(404).json({ message: "Occupant not found" });
        }
        res.status(200).json({
            message: "Successfully retrieved the occupant by id",
            data: occupant,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve the occupant by id",
            error: error.message,
        });
    }
};


// Update an occupant by id
// PUT localhost:3000/occupants/:id
const updateOccupantById = async (req, res) => {
    try {
        const occupant = await Occupant.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!occupant) {
            return res.status(404).json({ message: "Occupant not found" });
        }

        res.status(200).json({
            message: "Successfully updated the occupant",
            data: occupant,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to update the occupant",
            error: error.message,
        });
    }
};

// Delete a occupant by id
// DELETE - localhost:3000/occupants/:id
const deleteOccupant = async (req, res) => {
    try {
        const occupant = await Occupant.findOneAndDelete({ _id: req.params.id, user: req.user._id }).select('-user');
        if (!occupant) {
            return res.status(404).json({ message: "Occupant not found" });
        }
        res.status(200).json({
            message: "Successfully deleted the occupant",
            data: occupant,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete the occupant",
            error: error.message,
        });
    }
};

// Export the controller functions
module.exports = {
    createOccupant,
    getAllOccupants,
    getOccupantById,
    updateOccupantById,
    deleteOccupant,
};
