const express = require('express');
const router = express.Router();


const {createOrder, handlePayment, paymentCallback, getOrders} = require('../controllers/orderController')

router.get('/orders', getOrders)
router.post('/order/create', createOrder)
router.get('/order/pay/:id', handlePayment)
router.get('/payment/callback', paymentCallback)



module.exports = router