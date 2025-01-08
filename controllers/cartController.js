const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        const { quantity , productId} = req.body;

        // Find product
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Add to cart for the logged-in user
        await Cart.create({
            userId: req.user.id, // Retrieved from decoded JWT
            productId: product.id,
            quantity,
        });

        res.redirect('/cart'); // Redirect to the cart page
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
};

const viewCart = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId: req.user.id }, 
            include: [{
                model: Product, 
                attributes: ['id', 'name', 'imageUrl', 'NGNprice', 'USDprice', 'outOfStock'],
            },], 
        });

        res.render('cart', {cartItems} );
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};


const updateCartQuantity = async (req, res) => {
    try {
        const cartItemId = req.params.id;  // Get the cart item ID from the URL
        const newQuantity = req.body.quantity;  // Get the new quantity from the form

        if (!newQuantity || newQuantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity." });
        }

        // Find the cart item by ID and update its quantity
        const cartItem = await Cart.findOne({
            where: {
                id: cartItemId,
                userId: req.user.id,  // Ensure the cart item belongs to the logged-in user
            },
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        // Update the quantity of the item
        cartItem.quantity = newQuantity;
        await cartItem.save();

        // Redirect back to the cart page
        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ message: 'Error updating cart quantity.' });
    }
};



const checkout = async (req, res) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'NGNprice', 'USDprice'],
            }],
        });

        if (!cartItems || cartItems.length === 0) {
            return res.render('checkout', { total: 0, message: 'Your cart is empty.' });
        }

        // Calculate the total price
        let total = 0;
        const currency = req.query.currency || 'NGN'; // Default to NGN if not specified
        cartItems.forEach(item => {
            const price = currency === 'NGN' ? item.Product.NGNprice : item.Product.USDprice;
            total += price * item.quantity;
        });

        // Render the checkout page with the total
        res.render('checkout', { total: total.toFixed(2), currency });
    } catch (error) {
        console.error('Error fetching checkout details:', error);
        res.status(500).json({ message: 'Error fetching checkout details.' });
    }
};




const deleteCartItem = async (req, res) => {
    try {
        const cartItemId = req.params.id; // Get the cart item ID from the URL

        // Find the cart item and ensure it belongs to the logged-in user
        const cartItem = await Cart.findOne({
            where: {
                id: cartItemId,
                userId: req.user.id, // Ensure the cart item belongs to the current user
            },
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        // Delete the cart item
        await Cart.destroy({
            where: {
                id: cartItemId,
            },
        });

        // Redirect back to the cart page
        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Error deleting cart item.' });
    }
};





module.exports = { addToCart, viewCart, updateCartQuantity, checkout, deleteCartItem };
