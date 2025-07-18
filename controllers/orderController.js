const {Order, Cart} = require('../models/index')
const https = require('https');
require('dotenv').config();
const {getNumberOfProductsInCart} = require('../controllers/productController')



// Get orders for a user
const getOrders = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const userId = req.user.id; 
    const orders = await Order.find({ userId }).select(
      'id total payment_status order_status orderId deliveryMethod deliveryAddress phoneNumber createdAt'
    ).sort({ createdAt: -1 });

    res.render('order', { orders , message: "", cartCount});
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { total, deliveryMethod, deliveryAddress, currency, phoneNumber } = req.body;
    const userId = req.user.id;

    // Create a new order document
    const order = new Order({
      total,
      deliveryMethod,
      deliveryAddress,
      userId,
      payment_status: 'unpaid',
      currency,
      phoneNumber
    });

    await order.save(); 
    const orderId = order._id.toString();
   
    // Redirect to Paystack payment gateway
    res.redirect(`/order/pay/${orderId}`);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Initialize payment

const handlePayment = async (req, res) => {
  try {
    const orderId = req.params.id;


    // Find the order and its associated user
    const order = await Order.findById(orderId).populate('userId', 'email'); // Populate user's email

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prepare request data for Paystack
    const params = JSON.stringify({
      email: order.userId.email,
      amount: order.total * 100, // Convert amount to kobo
      reference: `order_${orderId}_${Date.now()}`,
      split: {
        type: "percentage", // or "flat"
        currency: "NGN",
        subaccounts: [
          { subaccount: "ACCT_ufytpe81jsb5n2q", share: 17 }, 
          { subaccount: "ACCT_x3g46kcjdg3gtg1", share: 20 }, 
          { subaccount: "ACCT_j5hjxncw5eb75rf", share: 3 }, 
        ],
      },
    });
    

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const reqPaystack = https.request(options, (resPaystack) => {
      let data = '';

      resPaystack.on('data', (chunk) => {
        data += chunk;
      });

      resPaystack.on('end', () => {
        const response = JSON.parse(data);

        res.redirect(`${response.data.authorization_url}`);
      });
    });

    reqPaystack.on('error', (error) => {
      console.error('Error initializing payment:', error);
      return res.status(500).json({ message: 'Error initializing payment' });
    });

    reqPaystack.write(params);
    reqPaystack.end();
  } catch (error) {
    console.error('Error initializing payment:', error);
    return res.status(500).json({ message: 'Error initializing payment' });
  }
};

// Verify payment
const paymentCallback = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }

    console.log('Verifying payment for reference:', reference);

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    https.get(options, async (resPaystack) => {
      let data = '';

      resPaystack.on('data', (chunk) => {
        data += chunk;
      });

      resPaystack.on('end', async () => {
        const response = JSON.parse(data);

        if (response.status && response.data.status === 'success') {
          const orderId = reference.split('_')[1] || null;
          if (!orderId) {
            return res.status(400).json({ message: 'Invalid order reference' });
          }

          const order = await Order.findById(orderId);
          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }

          
console.log(orderId)
          // Update the order's payment status
          order.payment_status = 'paid';
          order.transaction_id = response.data.id;
          order.orderId = orderId
          await order.save();

          // Clear the user's cart
          await Cart.deleteMany({ userId: req.user.id });
        

          res.redirect('/cart?message=Your Order has been placed successfully, We will reach out to you shortly');
        } else {
          return res.status(400).json({ message: 'Payment verification failed' });
        }
      });
    }).on('error', (error) => {
      console.error('Error verifying payment:', error);
      return res.status(500).json({ message: 'Error verifying payment' });
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ message: 'Error verifying payment' });
  }
};


module.exports = {
  getOrders,
  createOrder,
  handlePayment,
  paymentCallback,
};
