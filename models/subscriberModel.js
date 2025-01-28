const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Subscriber Schema
const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Unique constraint
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'], // Email validation regex
  },
  subscribedAt: {
    type: Date,
    default: Date.now, // Default value for date
  },
});

// Create and export the Subscriber model
const Subscriber = model('Subscriber', SubscriberSchema);
module.exports = {Subscriber}
