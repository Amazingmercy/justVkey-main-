const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Cart Schema
const CartSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1, 
  },
});

// Create and export the Cart model
const Cart = model('Cart', CartSchema);

module.exports = {Cart}
