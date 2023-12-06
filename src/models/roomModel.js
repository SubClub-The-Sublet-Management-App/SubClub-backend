const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
    },
    monthlyRentalPrice: {
       type: Number,
       required: true,
    },
    description: {
       type: String,
       required: true,
    },
    content: [
       {
         type: String,
         required: true,
       },
    ],
});

module.exports = mongoose.model('Room', RoomSchema);