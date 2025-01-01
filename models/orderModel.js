const { DataTypes } = require('sequelize');
const sequelize = require('../DB/config');


const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


module.exports = Order