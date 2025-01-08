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
        type: DataTypes.ENUM('unpaid', 'paid', 'failed'),
        defaultValue: 'unpaid',
    },
    transaction_id: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    deliveryMethod: {
        type: DataTypes.ENUM('pickup', 'delivery'),
        defaultValue: 'delivery',
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   userId: { // Foreign key to User
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Refers to the 'Users' table
            key: 'id',
        },
    }, 
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = Order;
