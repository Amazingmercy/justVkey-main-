const User = require('./userModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const Payment = require('./transactionModel');
const Cart = require('./cartModel')


// User Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasOne(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });


// Cart Relationship
Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });



module.exports = { User, Product, Order, Payment, Cart};
