const express = require('express');
const router = express.Router();
const upload = require('../middlewares/cloudinary');
const {getAddProduct, getEditProduct, getProducts, postAddProduct, postEditProduct, outOfStockProduct, addToTrend, updateOrCreateDeliveryPrices} = require('../controllers/adminProductController');


const {adminMiddleware} = require('../middlewares/authMiddleware')

router.use(adminMiddleware)

// Admin products routes
router.get('/products', getProducts);
router.get('/products/add', getAddProduct);
router.post('/products/add', upload.array('productImage', 5), postAddProduct)
router.get('/products/edit/:id', getEditProduct);
router.post('/products/edit/:id', upload.array('productImage', 5), postEditProduct);
router.post('/products/outOfStock/:id', outOfStockProduct);
router.post('/products/trending/:id', addToTrend);
router.post('/deliveryPrice/update', updateOrCreateDeliveryPrices);
  

module.exports = router;
