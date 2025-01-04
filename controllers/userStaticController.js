const Product = require('../models/productModel'); 


const getAboutUsPage = async (req, res) => {
  res.render('about')
}


const getContactUsPage = async (req, res) => {
  res.render('contact')
}


const getLatestProducts = async () => {
    const products = await Product.findAll({
        order: [['createdAt', 'DESC']],
        limit: 4, 
      });
    return products
}


const getTrendingProducts = async () => {
  const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4, 
    });
  return products
}


const getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    return products
  } catch (error) {
    console.error('Error fetching products:', error);
    return error
  }
};


const getBagsCategory = async (req, res) => {
  try {
    const bagsCollection = await Product.findAll({
      where: {
        category: 'Bags' 
      }
    });
    
    res.render('bag', {bagsCollection})
  } catch (error) {
    console.error('Error fetching products:', error);
    return error
  }
}; 


const getAccessoriesCategory = async (req, res) => {
  try {
    const accessoriesCollection = await Product.findAll({
      where: {
        category: 'Accessories' 
      }
    });
    
    res.render('accessories', {accessoriesCollection})
  } catch (error) {
    console.error('Error fetching products:', error);
    return error
  }
}; 


const getFunctionalArtsCategory = async (req, res) => {
  try {
    const functionalArtCollection = await Product.findAll({
      where: {
        category: 'Functional_Arts' 
      }
    });
    
    res.render('functionalArt', {functionalArtCollection})
  } catch (error) {
    console.error('Error fetching products:', error);
    return error
  }
}; 



const getHomePage = async (req, res) => {
  try {
    const {currency} = req.query
    const allProducts = await getAllProducts()
    const trendingProducts = await getTrendingProducts()
    const latestProducts = await getLatestProducts()

    res.render('index', {allProducts, trendingProducts, latestProducts, currency})
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};


module.exports = {
    getHomePage,
    getAboutUsPage,
    getContactUsPage,
    getAccessoriesCategory,
    getBagsCategory,
    getFunctionalArtsCategory
}