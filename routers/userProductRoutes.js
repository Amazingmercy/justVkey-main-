const express = require('express');
const router = express.Router();

// Assuming you have a User controller for handling logic
const {getHomePage, getProducts} = require('../controllers/userProductController');


router.get('/', getHomePage)
router.get('/products', getProducts)


module.exports = router;
