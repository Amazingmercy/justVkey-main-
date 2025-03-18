const { User } = require('../models/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
require('dotenv').config()



// Render the login page
const getLoginPage = (req, res) => {
    const redirectUrl = req.query.redirect || '/';
    const message = req.query.message
    res.render('login', { redirectUrl, message });
};

const getForgetPasswordPage = (req, res) => {
    const redirectUrl = req.query.redirect || '/';
    const message = req.query.message
    res.render('forgetPassword', { redirectUrl, message });
};

// Render the registration page
const getRegisterPage = (req, res) => {
    res.render('register', { message: "" });
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
        res.render('login', { message: 'User registered successfully', redirectUrl })
    } catch (error) {
        console.log('Error registering user', error)
        res.status(500).render('register', { message: 'Error registering user', redirectUrl });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password, redirectUrl } = req.body;

        const [user] = await User.find({ email: email });
        if (!user) {
            return res.render('login', { message: 'User not found.', redirectUrl });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { message: 'Invalid password.', redirectUrl });
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


const getResetPasswordPage = async (req, res) => {
    const {resetToken} = req.params
    
    const decodedToken = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    const user = await User.find({ email: decodedToken.email });

    if (!user) throw new Error("Invalid or expired token");
    res.render('resetPassword', {decodedToken, message: ""});
};

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
        const [user] = await User.find({ email: email });
        if (!user) throw new Error("User not found");

        const resetToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        


        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            host: "smtp@gmail.com",
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
        });

        const mailOptions = {
            to: email,
            subject: "JustVkey Password Reset Request",
            html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://res.cloudinary.com/dvmfubqhp/image/upload/v1742304644/justVkey%20product%20Images/logo/logo2_ozx7fe.jpg" alt="JustVkey Logo" style="max-width: 150px;">
                    </div>
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555; text-align: center;">
                        We received a request to reset your password. Click the button below to set a new password.  
                        If you did not request this, you can safely ignore this email.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.APP_URL}/reset-password/${resetToken}" 
                           style="display: inline-block; padding: 12px 20px; background-color: #000000; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                           Reset Password
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        This link is valid for 15minutes. If you need further assistance, please contact our support team.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        &copy; 2025 JustVkey. All rights reserved.
                    </p>
                </div>
            `
        };
        

        await transporter.sendMail(mailOptions);
        res.render('forgetPassword', { message: "Reset token sent to email" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error sending email to user', error });
    }
};



const resetPassword = async (req, res) => {
    try {
        const {newPassword, email} = req.body
        
        const [user] = await User.find({ email: email } );

        if (!user) throw new Error("Invalid or expired token");

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.redirect('/login?message=Password reset successful')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error resetting user password', error });
    }
}

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



const logOut = async (req, res) => {
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
    forgotPassword,
    resetPassword,
    deleteAccount,
    logOut,
    getResetPasswordPage,
    getForgetPasswordPage
}