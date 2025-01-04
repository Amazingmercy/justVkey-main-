const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const {getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct, outOfStockProduct} = require('../controllers/adminProductController');

// Admin products routes
router.get('/products', getProducts);
router.get('/products/add', getAddProduct);
router.post('/products/add', upload.single('productImage'), postAddProduct);
router.get('/products/edit/:id', getEditProduct);
router.post('/products/edit/:id', upload.single('productImage'), postEditProduct);
router.post('/products/outOfStock/:id', outOfStockProduct);

  

module.exports = router;
