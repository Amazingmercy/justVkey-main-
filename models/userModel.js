const mongoose = require('mongoose');
const { Schema , model} = mongoose;

// Define the User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique constraint
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'customer'], // Enum for role validation
    default: 'customer',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Create and export the User model
const User = model('User', UserSchema);
module.exports = {User}
