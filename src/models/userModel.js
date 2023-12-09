const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: String,
    number: Number,
    city: String,
    postCode: String,
    state: String
});

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: Date,
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /\S+@\S+\.\S+/ // simple regex to validate email format
    },
    password: { type: String, required: true },
    phoneNumber: String,
    address: addressSchema
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);






