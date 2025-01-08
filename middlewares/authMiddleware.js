const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Check for token in cookies, headers, or session
        
        const token = (req.headers.cookie).split('=')[1];

        if (!token) {
            // Redirect to login with the current URL as redirectUrl
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Auth Error:', error);
        return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
};

module.exports = authMiddleware;
