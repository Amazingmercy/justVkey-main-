const express = require('express');
const router = express.Router();

const {viewCart, addToCart, updateCartQuantity, checkout, deleteCartItem} = require('../controllers/cartController')
const duration = require('../routeCache')

router.post('/cart/update/:id', updateCartQuantity);
router.post('/cart/delete/:id', deleteCartItem)


//router.use(duration(3000)); 
router.get('/cart', viewCart)
router.get('/cart/add/:id', addToCart);
router.get('/checkout', checkout)



module.exports = router