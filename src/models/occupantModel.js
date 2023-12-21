const mongoose = require('mongoose');
const { Schema } = mongoose;


const contactSchema = new Schema({
  firstName: { 
    type: String,
    required: false,},
  lastName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  relationship: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
});

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
    type: contactSchema, 
    required: true 
  },
  reference: { 
    type: contactSchema, 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Occupant', occupantSchema);