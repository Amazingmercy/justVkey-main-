const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the Product Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['bags', 'accessories', 'functional_Art'], // Enum for categories
    required: true, // Category is required
  },
  NGNprice: {
    type: Number,
    required: true, // Price in NGN is required
  },
  USDprice: {
    type: Number,
    required: true, // Price in USD is required
  },
  imageUrl: {
    type: Array,
  },
  outOfStock: {
    type: Boolean,
    default: false, // Default value is false
  },
  trending: {
    type: Boolean,
    default: false, // Default value is false
  },
});

// Create and export the Product model
const Product = model('Product', ProductSchema);


module.exports = {Product}