

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

        const newOccupant = await Occupant.create(occupantData);
        res.json({
            message: "Successfully created a new Occupant",
            data: newOccupant,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a new Occupant",
            error: error.message,
        });
    }
};


module.exports = {
    createOccupant,

};
