const express = require('express')
const app = express()
require('dotenv').config()

const connectDB = require('./DB/config')
const MongoUri = process.env.MONGOURI
const cookieParser = require('cookie-parser');

require('./models/index')


//middlewares
const currency = require('./middlewares/currency')
const authMiddleware = require('./middlewares/authMiddleware');
const homeAuthMiddleware = require('./middlewares/homeAuthMiddleware');


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



app.use('/admin', adminProductRoutes, adminOrderRoutes)
app.use(currency)
app.use(userAuthRoutes)
app.use(homeAuthMiddleware,userProductRoutes)
app.use(authMiddleware, cartRoutes)
app.use(authMiddleware, orderRoutes)
 




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