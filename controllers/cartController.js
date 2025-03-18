const {Cart, Product, DeliveryPrice, Order} = require('../models/index');
const {getTrendingProducts, getNumberOfProductsInCart} = require('../controllers/productController')


// Add product to cart
const updateCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = parseInt(req.query.quantity) || 1;
 
  
    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity.' });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.render('cart', { message: 'Product not found' });
    }

    // Check if the product is already in the user's cart
    const existingCartItem = await Cart.findOne({ 
      userId: req.user.id,
      productId: productId
    });

    if (existingCartItem) {
      // Update quantity of existing cart item
      existingCartItem.quantity = quantity;
      await existingCartItem.save();
    } else {
      // Add new product to cart
      const cartItem = new Cart({
        userId: req.user.id,
        productId: product._id,
        quantity: quantity
      });
      await cartItem.save();
    }

    res.redirect('/cart');
  } catch (error) {
    console.error('Error updating cart:', error);
    res.render('cart', { message: 'Error updating cart' });
  }
};



// View cart
const viewCart = async (req, res) => {
  try {
    let cartCount = 0;
    let cartItems = [];
    let message =  req.query.message || '';

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
      
      // Fetch cart items only if the user has items in the cart
      cartItems = await Cart.find({ userId: req.user.id }).populate({
        path: 'productId',
        select: 'name description imageUrl NGNprice USDprice outOfStock',
      });

      if (!cartItems.productId == null) {
        message = 'Your cart is empty.';
      }
    }

    const trendingProducts = await getTrendingProducts();

    res.render('cart', { cartItems, message, trendingProducts, cartCount });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.render('cart', { cartItems: [], message: 'Error fetching cart', trendingProducts: [], cartCount: 0 });
  }
};


// Checkout
const checkout = async (req, res) => {
  try {
    let cartCount = 0;
    const currency = req.cookies.currency || 'NGN';

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const cartItems = await Cart.find({ userId: req.user.id }).populate({
      path: 'productId', // Populate product details
      select: 'name NGNprice USDprice',
    });

    if (!cartItems || cartItems.length === 0) {
      return res.render('checkout', { total: 0, currency, deliveryPrices: [], message: 'Your cart is empty.' });
    }

    // Calculate the cart total
    let total = 0;
    cartItems.forEach((item) => {
      const price = currency === 'NGN' ? item.productId.NGNprice : item.productId.USDprice;
      total += price * item.quantity;
    });

    

    // Fetch delivery prices from the database
    const deliveryPrices = await DeliveryPrice.find(); 
    const previousOrder = await Order.find({userId: req.user.id}).sort({createdAt: -1}).limit(1);
    const userDetails = previousOrder[0]
    res.render('checkout', {
      total: total.toFixed(2),
      currency,
      deliveryPrices, 
      message: '',
      cartCount,
      userDetails,
    });
  } catch (error) {
    console.error('Error fetching checkout details:', error);
    res.status(500).json({ message: 'Error fetching checkout details.' });
  }
};


// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    // Find and delete the cart item for the logged-in user
    const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, userId: req.user.id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    res.redirect('/cart'); // Redirect back to the cart page
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.render('cart', { message: 'Error deleting cart item.' });
  }
};

module.exports = { viewCart, updateCart, checkout, deleteCartItem };
