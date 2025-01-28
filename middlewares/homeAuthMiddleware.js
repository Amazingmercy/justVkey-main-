const jwt = require('jsonwebtoken');
const { getHomePage } = require('../controllers/productController');

const homeAuthMiddleware = async (req, res, next) => {
    try {
        // Ensure cookies object exists
        const token = req.cookies?.token;

        if (!token || token === 'undefined') {
            await getHomePage(req, res);
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Auth Error:', error.message);

        if (error.message === 'jwt expired') {
            // Redirect if token expired
            return res.redirect(303, `/login?redirect=${encodeURIComponent(req.originalUrl)}&message=Token expired`);
        }

        // Redirect for all other errors
        return res.redirect(303, `/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
};

module.exports = homeAuthMiddleware;
