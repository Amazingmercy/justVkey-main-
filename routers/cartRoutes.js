const express = require('express');
const router = express.Router();

const {viewCart, updateCart, checkout, deleteCartItem, } = require('../controllers/cartController')
const duration = require('../routeCache')



router.get('/cart/update/:id', updateCart);
router.post('/cart/delete/:id', deleteCartItem)


//router.use(duration(3000)); 
router.get('/cart', viewCart)
//router.get('/cart/add/:id', addToCart);
router.get('/checkout', checkout)



module.exports = router