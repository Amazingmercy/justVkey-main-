const Product = require('../models/productModel'); 
const {Op} = require('sequelize')


//functions
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


//route handler

const getAboutUsPage = async (req, res) => {
  res.render('about')
}


const getContactUsPage = async (req, res) => {
  res.render('contact')
}

const getServicesPage = async (req, res) => {
  res.render('services')
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


const getNumberOfProductsInCart = async (userId) => {
  try {
      // Get the number of unique products in the user's cart
      const productCount = await Cart.count({
          where: { userId: userId },  // Filter by the user's ID
          include: [{
              model: Product,         // Include the Product model
              attributes: ['id'],     // Only need the product ID to count
          }],
          distinct: true,  // Ensure we count distinct products
      });

      return productCount;  // Return the number of products in the cart
  } catch (error) {
      console.error('Error fetching product count in cart:', error);
      return 0;  // Return 0 in case of error
  }
};




const getHomePage = async (req, res) => {
  try {
    const {currency} = req.query
    let productCount = 0
    if (req.user == 'undefined') {
      productCount = await getNumberOfProductsInCart(req.user.id)
      console.log(productCount)
    }
    const trendingProducts = await getTrendingProducts()
    const latestProducts = await getLatestProducts()

    res.render('index', {trendingProducts, latestProducts, currency, productCount})
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
    getServicesPage,
    getAllProducts,
    getAccessoriesCategory,
    getBagsCategory,
    getFunctionalArtsCategory,
    handleProductSearch,
}