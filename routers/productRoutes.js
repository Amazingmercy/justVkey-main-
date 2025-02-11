const express = require('express');
const router = express.Router();


const {getHomePage, getAboutUsPage, getContactUsPage, getAccessoriesCategory, getBagsCategory, getFunctionalArtsCategory, getAllProducts, handleProductSearch, getServicesPage, subscribeToNews} = require('../controllers/productController');
const homeAuthMiddleware = require('../middlewares/homeAuthMiddleware');




router.get('/', getHomePage)
router.get('/about', getAboutUsPage)
router.get('/contact', getContactUsPage)
router.get('/services', getServicesPage)
router.get('/categories/bags', getBagsCategory)
router.get('/categories/accessories', getAccessoriesCategory)
router.get('/categories/functional_arts', getFunctionalArtsCategory)
router.get('/shop', getAllProducts)
router.get('/search', handleProductSearch)
router.post('/subscribe', subscribeToNews)



module.exports = router
