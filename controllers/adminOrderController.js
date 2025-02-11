const {Order} = require('../models/index');

// Get all orders
const getOrders = async (req, res) => {
  try {
    // Populate user name in the order (similar to Sequelize's include)
    const orders = await Order.find()
      .populate('userId', 'name') 
      .select('id total payment_status order_status deliveryMethod orderId deliveryAddress phoneNumber createdAt currency').sort({ createdAt: -1 });

    res.render('adminPages/allOrders', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
};

// Render add order form
const getOrderPage = (req, res) => {
  res.render('adminPages/addOrder');
};

// Handle add order submission
const addOrder = async (req, res) => {
  try {
    const { total, paymentStatus, orderStatus, transactionId, deliveryMethod, deliveryAddress, phoneNumber,  userId } = req.body;
    const newOrder = new Order({
      total,
      payment_status: paymentStatus,
      order_status: orderStatus,
      transaction_id: transactionId,
      deliveryMethod,
      deliveryAddress,
      phoneNumber,
      userId,
    });

    await newOrder.save();
    res.redirect('/admin/orders');
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).send('Error adding order');
  }
}

const changeOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.order_status = order_status;
      await order.save();  // Save the updated order
      res.redirect('/admin/orders');
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Error changing order status:', error);
    res.status(500).send('Error changing order status');
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderPage,
  changeOrderStatus

}