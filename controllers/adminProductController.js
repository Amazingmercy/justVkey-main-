const Product = require('../models/productModel'); 


const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('adminPages/allProducts', {products});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

// Render add product form
const getAddProduct = (req, res) => {
  res.render('adminPages/addProducts');
};

// Handle add product submission
const postAddProduct = async (req, res) => {
  try {
    const { name, description, category, USDprice , NGNprice} = req.body;
    const image = req.file ? req.file.path : null;

    await Product.create({ name, description, category, NGNprice, USDprice, imageUrl: image });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
};

// Render edit product form
const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({message: 'Product not found'});

    res.render('adminPages/editProducts', { product });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    res.status(500).send('Error fetching product');
  }
};

// Handle edit product submission
const postEditProduct = async (req, res) => {
  try {
    const { name, description, category, NGNprice, USDprice, productImage } = req.body;
    await Product.update({ name, description, category, NGNprice, USDprice, productImage }, {
      where: { id: req.params.id }
    });
      res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
};

// Handle delete product
const outOfStockProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.render('adminPages/allProducts',{ message: 'Product not found.' });
        }
    await Product.update({
      outOfStock: true }, {
        where: { id: req.params.id }
  });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
};





module.exports = {
  getAddProduct,
  getEditProduct,
  getProducts,
  outOfStockProduct,
  postAddProduct,
  postEditProduct,
}