const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check if the route is for password reset or forgot password
    const passwordResetRoutes = [
        '/forgot-password',
        '/reset-password',
        '/login'
    ];
    
    // If it's a password reset route or starts with /reset-password/, bypass auth check
    if (passwordResetRoutes.includes(req.path) || req.path.startsWith('/reset-password/')) {
        return next();
    }
    
    try {
        // Check for token in cookies
        const token = req.cookies.token;
        
        if (!token || token === 'undefined') {
            // Redirect to login with the current URL as redirectUrl
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        const message = error.message === 'jwt expired' ? '' : `&message=${encodeURIComponent(error.message)}`;
        return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}${message}`);
    }
};



const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.redirect('/login?message=Access denied, You are not an admin')
    }
    next();
};


module.exports = {
    authMiddleware,
    adminMiddleware,
}
