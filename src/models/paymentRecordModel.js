const mongoose = require('mongoose');
const { Schema } = mongoose;
const RoomAssignment = require('./roomAssignmentModel'); 


const paymentRecordSchema = new Schema({

    // Room Assignment reference
    roomAssignment: { 
        type: mongoose.Types.ObjectId, 
        ref: 'RoomAssignment' 
    }, 
    // reference to the User
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    paymentType:{
        type: String, 
        required: true 
    },
    amountPaid:{ 
        type:Number,
        required:true
    },
    paymentDate:{
        type: Date,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('PaymentRecord', paymentRecordSchema);