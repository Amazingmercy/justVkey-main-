const express = require('express');
const router = express.Router();
// Assuming you have a User controller for handling logic
const {getLoginPage, getRegisterPage, login, register, deleteAccount, logOut } = require('../controllers/userController');


router.get('/login', getLoginPage)
router.post('/login', login)
router.get('/register', getRegisterPage)
router.post('/register', register)
router.delete('/account', deleteAccount);
router.get('/logout', logOut);



module.exports = router;
