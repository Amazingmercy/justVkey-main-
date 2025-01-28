const {Product, DeliveryPrice} = require('../models/index');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const deliveryPrices = await DeliveryPrice.find()
    res.render('adminPages/allProducts', { products, deliveryPrices, message: ""});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

// Render add product form
const getAddProduct = (req, res) => {
  res.render('adminPages/addProducts', {message: ""});
};

// Handle add product submission
const postAddProduct = async (req, res) => {
  try {
    const { name, description, category, USDprice, NGNprice } = req.body;
    const image = req.file ? req.file.path : null;


    await Product.create({
      name,
      description,
      category,
      NGNprice,
      USDprice,
      imageUrl: image,
    });

    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error adding product');
    res.status(500).send('Error adding product');
  }
};

// Render edit product form
const getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID
    if (!product) return res.render('adminPages/editProducts', { message: 'Product not found' });

    res.render('adminPages/editProducts', { product, message: "" });
  } catch (error) {
    console.error('Error fetching product for edit:', error);
    res.render('adminPages/editProducts', {message: 'Error fetching product'});
  }
};

// Handle edit product submission
const postEditProduct = async (req, res) => {
  try {
    const { name, description, category, NGNprice, USDprice } = req.body;
    const image = req.file ? req.file.path : null;

    const product = await Product.findById(req.params.id); // Find product by ID
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name;
    product.description = description;
    product.category = category;
    product.NGNprice = NGNprice;
    product.USDprice = USDprice;
    if (image) product.imageUrl = image;

    await product.save(); // Save the updated product
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
};

// Handle mark product as out of stock
const outOfStockProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Find product by ID
    if (!product) {
      return res.render('adminPages/allProducts', { message: 'Product not found.' });
    }

    product.outOfStock = true; // Update outOfStock field
    await product.save(); // Save the updated product
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error marking product as out of stock:', error);
    res.status(500).send('Error marking product as out of stock');
  }
};

const addToTrend = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); 
    if (!product) {
      return res.render('adminPages/allProducts', { message: 'Product not found.' });
    }

    product.trending = true; // Update outOfStock field
    await product.save(); // Save the updated product
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error marking product as trending', error);
    res.status(500).send('Error marking product as trending');
  }
};



const updateOrCreateDeliveryPrices = async (req, res) => {
  try {
    const { prices } = req.body; 

    for (const key in prices) {
      const { location, NGNprice, USDprice } = prices[key];

      // Check if the location already exists in the database
      const existingEntry = await DeliveryPrice.findOne({ location });

      if (existingEntry) {
        // If the location exists, update the NGNprice and USDprice
        await DeliveryPrice.findByIdAndUpdate(
          existingEntry._id,
          { NGNprice, USDprice },
          { new: true }
        );
      } else {
        // If the location is unique, create a new entry
        await DeliveryPrice.create({ location, NGNprice, USDprice });
      }
    }

    res.redirect('/admin/products'); // Redirect after update or creation
  } catch (error) {
    console.error('Error updating or creating delivery prices:', error);
    res.status(500).send('Failed to update or create delivery prices.');
  }
};


module.exports = {
  getAddProduct,
  getEditProduct,
  getProducts,
  outOfStockProduct,
  postAddProduct,
  postEditProduct,
  addToTrend,
  updateOrCreateDeliveryPrices,
};
