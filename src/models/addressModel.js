const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
});