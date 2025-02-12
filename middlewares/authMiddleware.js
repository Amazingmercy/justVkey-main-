const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    try {
        // Check for token in cookies, headers, or session

        const token = (req.cookies.token);

        if (!token || token == 'undefined') {
            // Redirect to login with the current URL as redirectUrl
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`)
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Auth Error:', error.message);
        if(error.message == 'jwt expired') {
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`)
        } else {
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`, {message: error.message});
        }
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
    adminMiddleware
}
