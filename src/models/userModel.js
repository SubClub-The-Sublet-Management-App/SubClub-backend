const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Occupant = require('./occupantModel');
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

// If user gets deletes also delete all occupants associated with that user
userSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Occupant.deleteMany({
            user: doc._id
        });
    }
});

module.exports = mongoose.model('User', userSchema);






