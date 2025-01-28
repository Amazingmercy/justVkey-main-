const {User} = require('./userModel');
const {Order} = require('./orderModel');
const {Product} = require('./productModel');
const {Cart} = require('./cartModel');
const {Subscriber} = require('./subscriberModel');
const {DeliveryPrice} = require('./deliveryPriceModel')

// Export all models in a single object
module.exports = {
  User,
  Order,
  Product,
  Cart,
  Subscriber,
  DeliveryPrice
};
