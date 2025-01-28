const {User} = require('../models/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Render the login page
const getLoginPage = (req, res) => {
    const redirectUrl = req.query.redirect || '/'; 
    res.render('login', { redirectUrl, message: ""});
};

// Render the registration page
const getRegisterPage = (req, res) => {
    res.render('register', {message: ""});
};




const register = async (req, res) => {
    const redirectUrl = req.query.redirect || '/'; 
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('register', { message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        //res.status(201).json({ message: 'User registered successfully', user: newUser });
        res.render('login', {message: 'User registered successfully', redirectUrl})
    } catch (error) {
        console.log('Error registering user', error)
        res.status(500).render('register', { message: 'Error registering user', redirectUrl});
}
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password, redirectUrl } = req.body;

        const [user] = await User.find({ email: email});
        if (!user) {
            return res.render('login', { message: 'User not found.' , redirectUrl});
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid password.' , redirectUrl});
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });

        // Set token as cookie and redirect to the desired page
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });        
        if (user.role == 'admin') {
            return res.redirect('/admin/products');
        } else {
            return res.redirect(redirectUrl || '/');
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error logging in user', error });
    }
};


//Not functional
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.update({
            isDeleted: true
        });
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};



const logOut = async(req,res) => {
        res.cookie('token', null, { 
            httpOnly: true, 
            secure: false, // Use true if you're on HTTPS
            maxAge: 0, // This immediately expires the cookie
        });
        res.redirect('/');
};

  



module.exports = {
    getLoginPage,
    getRegisterPage,
    login,
    register,
    deleteAccount,
    logOut
}