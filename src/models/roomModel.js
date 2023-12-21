const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
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

  // reference to the User
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', // reference to the User model
    required: true 
  },

});


module.exports = mongoose.model('Room', roomSchema);