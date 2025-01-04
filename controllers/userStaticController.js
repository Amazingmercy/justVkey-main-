const Product = require('../models/productModel'); 
const {Op} = require('sequelize')


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


const getAllProducts = async (req,res) => {
  try {
    const products = await Product.findAll();
    res.render('shop', {products})
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
    const {search} = req.params
    const {currency} = req.query
    const trendingProducts = await getTrendingProducts()
    const latestProducts = await getLatestProducts()

    res.render('index', {trendingProducts, latestProducts, currency})
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};


const handleProductSearch = async (req, res) => {
    try {
      let products = await Product.findAll()
      const { search } = req.query; 
      if (!search || search.length < 1) {
      return res.render('shop', {products})
      }
  
       products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`, 
          },
        },
      });
  
      if (products.length === 0) {
        return res.render('index', products, {message: 'No product found'})
      }
  
      // Return the search results
      res.render('shop', {products})
    } catch (error) {
      console.error('Error searching for product:', error);
      res.status(500).json({ message: 'An error occurred while searching for the product' });
    }
  
} 

module.exports = {
    getHomePage,
    getAboutUsPage,
    getContactUsPage,
    getAllProducts,
    getAccessoriesCategory,
    getBagsCategory,
    getFunctionalArtsCategory,
    handleProductSearch
}