const mongoose = require('mongoose');
const { Schema } = mongoose;
const Occupant = require('./occupantModel');
const Room = require('./roomModel');


const roomAssignmentSchema = new Schema({
    // Room reference
    room: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Room',
        required: true 

    }, 

    // Occupant reference
    occupant: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Occupant' ,
        required: true 
    }, 

    // reference to the User
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // reference to the User model
        required: true 
    },

    // Agreement reference
    startDate: { 
        type: Date, 
        required: true 
    },  
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return this.startDate <= value;
            },
            message: 'End Date cannot be before Start Date.'
        }
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

    isActive: {
        type: Boolean,
        default: true,
    },
    isAssigned: {
        type: Boolean,
        default: true,
    },
    
});

module.exports = mongoose.model('RoomAssignment', roomAssignmentSchema);