const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const addressSchema = require('./addressModel');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: false
    },
    address: {
        type: addressSchema,
        required: false
    },

});

module.exports = mongoose.model('User', userSchema);