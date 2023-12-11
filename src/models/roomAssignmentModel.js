const mongoose = require('mongoose');
const { Schema } = mongoose;
const Occupant = require('./occupantModel');
const Room = require('./roomModel');


const roomAssignmentSchema = new Schema({
    // Room reference
    room: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Room' 
    }, 

    // Occupant reference
    occupant: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Occupant' 
    }, 

    // reference to the User
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // reference to the User model
        required: true 
    },

    // Agreement reference

    agreement: {
        startDate: { 
            type: Date, 
            required: true 
        },  
        endDate: { 
            type: Date,
            required: true 
        },  
        rentInclusions: { 
            type: [String], 
            required: true 
        },
        rentalPayment: { 
            type: Number, 
            required: true 
        },
        rentalPaymentFrequency: { 
            type: String, 
            required: true 
        },
        securityDeposit: { 
            type: Number, 
            required: true 
        },
    },
    rentalAgreementStatus: String
    
});


module.exports = mongoose.model('RoomAssignment', roomAssignmentSchema);