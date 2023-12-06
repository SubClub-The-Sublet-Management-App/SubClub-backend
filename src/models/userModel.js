const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    street: String,
    number: Number,
    city: String,
    postCode: String,
    state: String
});

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /\S+@\S+\.\S+/ // simple regex to validate email format
    },
    password: { type: String, required: true },
    phoneNumber: String,
    address: AddressSchema
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);








// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const bcrypt = require('bcrypt');


// const UserSchema = new Schema({
//     firstName: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     dob: {
//         type: Date,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: false
//     },
//     address: { 
//         street: {
//             type: String,
//             required: false
//         },
//         number: {
//             type: Number,
//             required: false
//         },
//         city: {
//             type: String,
//             required: false
//         },
//         postCode: {
//             type: String,
//             required: false
//         },
//         state: {
//             type: String,
//             required: false
//         }
//     },

// });

// module.exports = mongoose.model('User', UserSchema);