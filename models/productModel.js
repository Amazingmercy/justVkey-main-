const { DataTypes } = require('sequelize');
const sequelize = require('../DB/config');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    category: {
        type: DataTypes.ENUM,
        values: ['Bags', 'Accessories'], 
        allowNull: false, 
      },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    outOfStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Product;
