const express = require('express');
const router = express.Router();


const {createOrder, handlePayment, paymentCallback} = require('../controllers/orderController')


router.post('/order/create', createOrder)
router.get('/order/pay/:id', handlePayment)
router.get('/payment/callback', paymentCallback)



module.exports = router