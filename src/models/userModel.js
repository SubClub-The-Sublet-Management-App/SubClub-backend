const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    phoneNumber: {
        type: String,
        required: false
    },
    address: { 
        street: {
            type: String,
            required: false
        },
        number: {
            type: Number,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        postCode: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        }
    },

});

module.exports = mongoose.model('User', userSchema);