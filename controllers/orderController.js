const Order = require('../models/orderModel')
const User = require('../models/userModel')
require('dotenv').config()


const createOrder = async (req, res) => {
    try {
        const { total, deliveryOption , deliveryAddress} = req.body;
        const userId = req.user.id;  
        
        // Create order in the Order table
        const order = await Order.create({
            total,
            deliveryOption,
            deliveryAddress,
            userId,
            payment_status: 'unpaid',  
        });

        // Redirect to Paystack payment gateway
        res.redirect(`/order/pay/${order.id}`);
    } catch (error) {
        //console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};



const https = require('https');

// Initialize Payment
const handlePayment = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order and its associated user
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: User,
          attributes: ['id', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Prepare request data
    const params = JSON.stringify({
      email: order.User.email,
      amount: order.total * 100, // Convert amount to kobo
      reference: `order_${orderId}_${Date.now()}`,
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

      resPaystack.on('end', async () => {
        const response = JSON.parse(data);

        if (response.status) {
          // Send authorization URL to the client
          res.redirect(`${response.data.authorization_url}?reference=${response.data.reference}`);
        } else {
          return res.status(400).json({ message: response.message });
        }
      });
    });

    reqPaystack.on('error', (error) => {
      console.error(error);
      res.status(500).json({ message: 'Error initializing payment' });
    });

    reqPaystack.write(params);
    reqPaystack.end();
  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({ message: 'Error initializing payment' });
  }
};

// Verify Payment
const paymentCallback = async (req, res) => {
  try {
    const { reference } = req.params; // Extract the reference from the request
    if (!reference) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    https.request(options, async (resPaystack) => {
      let data = '';

      resPaystack.on('data', (chunk) => {
        data += chunk;
      });

      resPaystack.on('end', async () => {
        const response = JSON.parse(data);

        if (response.status && response.data.status === 'success') {
          // Payment was successful
          const orderId = reference.split('_')[1]; // Extract order ID from reference
          const order = await Order.findByPk(orderId);

          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }

          order.payment_status = 'paid';
          order.transaction_id = response.data.id;
          order.paid_at = response.data.paid_at;
          await order.save();

          await Cart.destroy({ where: req.user.id  });
          return res.render('cart', {message: "Your Order has been placed successfully, We will reach out to you shortly, or Reachout to us by calling: 08137994827"});
        } else {
          return res.status(400).json({ message: 'Payment verification failed' });
        }
      });
    })
      .on('error', (error) => {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Error verifying payment' });
      })
      .end();
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};



module.exports = {
    createOrder,
    handlePayment,
    paymentCallback
}