const express = require('express');
const router = express.Router();



const {getHomePage, getAboutUsPage, getContactUsPage, getAccessoriesCategory, getBagsCategory, getFunctionalArtsCategory, getAllProducts, handleProductSearch, getServicesPage, subscribeToNews} = require('../controllers/productController');
const homeAuthMiddleware = require('../middlewares/homeAuthMiddleware');
const duration = require('../routeCache')


router.use(homeAuthMiddleware)

router.post('/subscribe', subscribeToNews)

//router.use(duration(3000)); 
router.get('/', getHomePage)
router.get('/about', getAboutUsPage)
router.get('/contact', getContactUsPage)
router.get('/services', getServicesPage)
router.get('/categories/bags', getBagsCategory)
router.get('/categories/accessories', getAccessoriesCategory)
router.get('/categories/functional_arts', getFunctionalArtsCategory)
router.get('/shop', getAllProducts)
router.get('/search', handleProductSearch)




module.exports = router
