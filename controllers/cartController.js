const {Cart, Product, DeliveryPrice} = require('../models/index');
const {getTrendingProducts, getNumberOfProductsInCart} = require('../controllers/productController')


// Add product to cart
const addToCart = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.render('cart', { message: 'Product not found' });
    }

    // Add product to cart for the logged-in user
    const cartItem = new Cart({
      userId: req.user.id, // Retrieved from decoded JWT
      productId: product._id,
    });

    await cartItem.save(); // Save cart item to the database
    res.redirect('/cart'); // Redirect to the cart page
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.render('cart', { message: 'Error adding product to cart' });
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
        select: 'name imageUrl NGNprice USDprice outOfStock',
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


// Update cart quantity
const updateCartQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.id; // Get the cart item ID from the URL
    const newQuantity = req.body.quantity; // Get the new quantity from the form

    if (!newQuantity || newQuantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity.' });
    }

    // Find the cart item by ID and update its quantity
    const cartItem = await Cart.findOne({ _id: cartItemId, userId: req.user.id });
    if (!cartItem) {
      return res.render('cart', { message: 'Cart item not found.' });
    }

    cartItem.quantity = newQuantity; // Update the quantity
    await cartItem.save(); // Save the updated cart item

    res.redirect('/cart'); // Redirect back to the cart page
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.render('cart', { message: 'Error updating cart quantity.' });
  }
};

// Checkout
const checkout = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const cartItems = await Cart.find({ userId: req.user.id }).populate({
      path: 'productId', // Populate product details
      select: 'name NGNprice USDprice',
    });

    if (!cartItems || cartItems.length === 0) {
      return res.render('checkout', { total: 0, currency: 'NGN', deliveryPrices: [], message: 'Your cart is empty.' });
    }

    // Calculate the cart total
    let total = 0;
    const currency = req.query.currency || 'NGN';
    cartItems.forEach((item) => {
      const price = currency === 'NGN' ? item.productId.NGNprice : item.productId.USDprice;
      total += price * item.quantity;
    });

    

    // Fetch delivery prices from the database
    const deliveryPrices = await DeliveryPrice.find(); 
    res.render('checkout', {
      total: total.toFixed(2),
      currency,
      deliveryPrices, 
      message: '',
      cartCount
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

module.exports = { addToCart, viewCart, updateCartQuantity, checkout, deleteCartItem };
