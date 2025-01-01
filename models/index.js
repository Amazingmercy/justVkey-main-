const User = require('./userModel');
const Product = require('./productModel');
const Order = require('./orderModel');
const Payment = require('./transactionModel');

// Relationships
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasOne(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });



module.exports = { User, Product, Order, Payment };
