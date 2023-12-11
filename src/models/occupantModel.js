const mongoose = require('mongoose');
const { Schema } = mongoose;


const contactSchema = new Schema({
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
});

module.exports = mongoose.model('Occupant', occupantSchema);