const mongoose = require('mongoose');
const { Schema } = mongoose;


const occupantSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  emergencyContact: {
    firstName: {  
      type: String,
      required: true,
      },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  reference: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
  },

  // reference to the User
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', // reference to the User model
    required: true 
  },
});

module.exports = mongoose.model('Occupant', occupantSchema);