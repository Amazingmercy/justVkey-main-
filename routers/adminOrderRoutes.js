const express = require('express');
const router = express.Router();
const { getOrders, getOrderPage, addOrder, changeOrderStatus } = require('../controllers/adminOrderController');

const {adminMiddleware} = require('../middlewares/authMiddleware')

router.use(adminMiddleware)

// Admin orders routes
router.get('/orders', getOrders);
router.get('/orders/add', getOrderPage);
router.post('/orders/add', addOrder);
router.post('/orders/edit/:id', changeOrderStatus);


module.exports = router;