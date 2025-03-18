const express = require('express');
const router = express.Router();
// Assuming you have a User controller for handling logic
const {getLoginPage, getRegisterPage, login, register, deleteAccount, logOut, forgotPassword, resetPassword, getForgetPasswordPage, getResetPasswordPage } = require('../controllers/userController');



router.get('/login', getLoginPage)
router.post('/login', login)
router.get('/register', getRegisterPage)
router.post('/register', register)
router.delete('/account', deleteAccount);
router.get('/logout', logOut);
router.get('/forgot-password', getForgetPasswordPage);
router.get('/reset-password/:resetToken', getResetPasswordPage);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
