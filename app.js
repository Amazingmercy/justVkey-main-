const express = require('express')
const app = express()
require('dotenv').config()

const connectDB = require('./DB/config')
const MongoUri = process.env.MONGOURI
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

require('./models/index')


//middlewares
const currency = require('./middlewares/currency')
const {authMiddleware} = require('./middlewares/authMiddleware');



//routes
const userAuthRoutes = require('./routers/userRoutes')
const adminProductRoutes = require('./routers/adminProductRoutes')
const adminOrderRoutes = require('./routers/adminOrderRoutes')
const userProductRoutes = require('./routers/productRoutes')
const cartRoutes = require('./routers/cartRoutes')
const orderRoutes = require('./routers/orderRoutes')


//view Engine set up
app.set('view engine', 'ejs');
app.set('views', './views');

  

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser());



//security middlewares
app.use(cors());
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "*.cloudinary.com", "res.cloudinary.com"],
//       scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*.bootstrapcdn.com", "*.fontawesome.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
//       scriptSrcAttr: ["'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'", "*.bootstrapcdn.com", "*.fontawesome.com", "cdnjs.cloudflare.com", "cdn.jsdelivr.net", "fonts.googleapis.com"],
//       fontSrc: ["'self'", "*.fontawesome.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
//       connectSrc: ["'self'", "*.cloudinary.com", "api.paystack.com", "https://api.paystack.com"], // Allow Paystack API
//       mediaSrc: ["'self'", "res.cloudinary.com"],
//       formAction: ["'self'", "https://justvkeyluxuries.com.ng", "https://api.paystack.com"] 
//     }
//   }
// }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use(compression());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use(currency)
app.use(userAuthRoutes)
app.use(userProductRoutes)

app.use(authMiddleware)
app.use(cartRoutes)
app.use(orderRoutes)
app.use('/admin', adminProductRoutes, adminOrderRoutes)


 




const port = process.env.PORT || 1414
app.listen(port, async() => {
    try {
        await connectDB(MongoUri)
        console.log('Connection has been established successfully.');
        console.log(`Server is listening on port ${port}`)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})