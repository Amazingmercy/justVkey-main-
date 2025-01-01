const Product = require('../models/productModel'); 

const getHomePage = async (req, res) => {
    const products = await Product.findAll({
        order: [['createdAt', 'DESC']],
        limit: 4, 
      });
    res.render('index', {products})
}


const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('allProducts', {products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};


module.exports = {
    getHomePage,
    getProducts
}