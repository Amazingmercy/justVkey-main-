const express = require('express');
const router = express.Router();



const {viewCart, addToCart, updateCartQuantity, checkout, deleteCartItem} = require('../controllers/cartController')


router.get('/cart', viewCart)
router.get('/cart/add/:id', addToCart);
router.post('/cart/update/:id', updateCartQuantity);
router.get('/checkout', checkout)
router.post('/cart/delete/:id', deleteCartItem)


module.exports = router