const express = require('express')
const app = express()

const sequelize = require('./DB/config')
require('./models/index')


//middlewares
const currency = require('./middlewares/currency')
const authMiddleware = require('./middlewares/authMiddleware');

//routes
const userAuthRoutes = require('./routers/userAuthenticationRoutes')
const adminRoutes = require('./routers/adminProductRoutes')
const userProductRoutes = require('./routers/userProductRoutes')
const cartRoutes = require('./routers/cartRoutes')
const orderRoutes = require('./routers/orderRoutes')


app.set('view engine', 'ejs');
app.set('views', './views');

  

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))


app.use(currency)
app.use('/admin', adminRoutes)
app.use(userAuthRoutes)
app.use(userProductRoutes)
app.use(authMiddleware, cartRoutes)
app.use(authMiddleware, orderRoutes)
 




const port = process.env.PORT || 1414
app.listen(port, async() => {
    try {
        await sequelize.authenticate();
        //await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
        console.log(`Server is listening on port ${port}`)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})