const { Product, Cart, Subscriber } = require('../models/index');

// Functions
const getLatestProducts =  async () => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);
    return products;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
};

const getTrendingProducts = async () => {
  try {
    let products = await Product.find({ trending: true }).sort({ createdAt: -1 }).limit(8);              

    return products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};
const getNumberOfProductsInCart = async (userId) => {
  try {
    const productCount = await Cart.countDocuments({ userId });
    return productCount;
  } catch (error) {
    console.error('Error fetching product count in cart:', error);
    return 0;
  }
};





// Route Handlers
const getSingleProduct = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const product = await Product.findById(req.params.id);
    res.render('product', { product , message: "", cartCount});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

const getAboutUsPage = async (req, res) => {
  const trendingProducts = await getTrendingProducts();
  let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
  res.render('about', { trendingProducts, message: "",  cartCount });
};

const getContactUsPage = async (req, res) => {
  let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
  res.render('contact', {message: "", cartCount });
};

const getServicesPage = async (req, res) => {
  const trendingProducts = await getTrendingProducts();
  let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
  res.render('services', { trendingProducts, message: "", cartCount });
};

const getAllProducts = async (req, res) => {
  try {
    let cartCount = 0; 
    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const products = await Product.find();
    res.render('shop', { products , message: "", cartCount});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

const getBagsCategory = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const bagsCollection = await Product.find({ category: 'bags' });
    res.render('bag', { bagsCollection, message: "", cartCount });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

const getAccessoriesCategory = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const accessoriesCollection = await Product.find({ category: 'accessories' });
    res.render('accessories', { accessoriesCollection, message: "" , cartCount});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

const getFunctionalArtsCategory = async (req, res) => {
  try {
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    const functionalArtCollection = await Product.find({ category: 'functionalArts' });
    res.render('functionalArt', { functionalArtCollection , message: "", cartCount});
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
};

const getHomePage = async (req, res) => {
  try {
    const { currency } = req.cookies;
    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }


    const trendingProducts = await getTrendingProducts();
    const latestProducts = await getLatestProducts();

    res.render('index', { trendingProducts, latestProducts, currency, cartCount, message: '' });
  } catch (error) {
    console.error('Error fetching home page data:', error);
    res.status(500).send('Error fetching home page data');
  }
};


const subscribeToNews = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      const message = 'Email is already subscribed!';
      return getHomePage(req, res, message);
    }

    await Subscriber.create({ email });
    const message = 'Successfully subscribed to the newsletter!';
    return getHomePage(req, res, message);
  } catch (error) {
    console.error('Error saving subscriber:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleProductSearch = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search || search.length < 1) {
      const products = await Product.find();
      return res.render('shop', { products , message: ''});
    }

    const products = await Product.find({
      name: { $regex: search, $options: 'i' },
    });

    if (products.length === 0) {
      return res.render('index', { message: 'No product found', products });
    }  

    let cartCount = 0;

    if (req.user) {
      cartCount = await getNumberOfProductsInCart(req.user.id);
    }
    res.render('shop', { products , message: '', cartCount});
  } catch (error) {
    console.error('Error searching for product:', error);
    res.status(500).json({ message: 'An error occurred while searching for the product' });
  }
};

module.exports = {
  getHomePage,
  getAboutUsPage,
  getContactUsPage,
  getServicesPage,
  getAllProducts,
  getSingleProduct,
  getAccessoriesCategory,
  getBagsCategory,
  getFunctionalArtsCategory,
  handleProductSearch,
  subscribeToNews,
  getTrendingProducts,
  getNumberOfProductsInCart
};
