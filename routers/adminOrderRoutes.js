const express = require('express');
const router = express.Router();
const { getOrders, getOrderPage, addOrder, changeOrderStatus } = require('../controllers/adminOrderController');

// Admin orders routes
router.get('/orders', getOrders);
router.get('/orders/add', getOrderPage);
router.post('/orders/add', addOrder);
router.post('/orders/edit/:id', changeOrderStatus);


module.exports = router;