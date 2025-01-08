const {User}  = require('../models/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Render the login page
const getLoginPage = (req, res) => {
    const redirectUrl = req.query.redirect || '/'; 
    res.render('login', { redirectUrl, message: ""}, );
};

// Render the registration page
const getRegisterPage = (req, res) => {
    res.render('register', {message: ""});
};




const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
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
        res.render('login', {message: 'User registered successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password, redirectUrl } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '9h' });

        // Set token as cookie and redirect to the desired page
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 9 });
        res.redirect(redirectUrl || '/');
    } catch (error) {
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




module.exports = {
    getLoginPage,
    getRegisterPage,
    login,
    register,
    deleteAccount
}