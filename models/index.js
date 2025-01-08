const User = require('./userModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const Cart = require('./cartModel')


// User Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });


// Cart Relationship
Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });



module.exports = { User, Product, Order, Cart};
