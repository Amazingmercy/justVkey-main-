const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Order Schema
const OrderSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'], 
    default: 'unpaid',
  },
  order_status: {
    type: String,
    enum: ['processing', 'completed'],
    default: 'processing',
  },
  transaction_id: {
    type: String, 
    default: null,
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true,
  },
  deliveryAddress: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    allowNull: false,
  },
  currency: {
    type: String,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User', 
    required: true,
  },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

// Create and export the Order model
const Order = model('Order', OrderSchema);
module.exports = {Order}
