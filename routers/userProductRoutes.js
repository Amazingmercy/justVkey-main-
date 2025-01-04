const express = require('express');
const router = express.Router();

// Assuming you have a User controller for handling logic
const {getHomePage, getAboutUsPage, getContactUsPage, getAccessoriesCategory, getBagsCategory, getFunctionalArtsCategory, getAllProducts, handleProductSearch} = require('../controllers/userStaticController');


router.get('/', getHomePage)
router.get('/about', getAboutUsPage)
router.get('/contact', getContactUsPage)
router.get('/categories/bags', getBagsCategory)
router.get('/categories/accessories', getAccessoriesCategory)
router.get('/categories/functional_arts', getFunctionalArtsCategory)
router.get('/shop', getAllProducts)
router.get('/search', handleProductSearch)

module.exports = router;
