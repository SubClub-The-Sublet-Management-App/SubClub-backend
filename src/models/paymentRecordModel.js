const mongoose = require('mongoose');
const { Schema } = mongoose;
const RoomAssignment = require('./roomAssignmentModel'); 


const paymentRecordSchema = new Schema({

    // Room Assignment reference
    roomAssignment: { 
        type: mongoose.Types.ObjectId, 
        ref: 'RoomAssignment' 
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
    receiptStatus: String
});

module.exports = mongoose.model('PaymentRecord', paymentRecordSchema);