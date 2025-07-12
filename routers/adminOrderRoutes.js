const express = require('express');
const router = express.Router();
const { getOrders, getOrderPage, addOrder, changeOrderStatus, getUsers } = require('../controllers/adminOrderController');

const {adminMiddleware} = require('../middlewares/authMiddleware')

router.use(adminMiddleware)

// Admin orders routes
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/orders/add', getOrderPage);
router.post('/orders/add', addOrder);
router.post('/orders/edit/:id', changeOrderStatus);


module.exports = router;