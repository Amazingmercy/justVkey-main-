const express = require('express')
const app = express()

const sequelize = require('./DB/config')
require('./models/index')


//routes
const userAuthRoutes = require('./routers/userAuthenticationRoutes')
const adminRoutes = require('./routers/adminProductRoutes')
const userProductRoutes = require('./routers/userProductRoutes')


app.set('view engine', 'ejs');
app.set('views', './views');



app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))


app.use('/admin', adminRoutes)
app.use(userAuthRoutes)
app.use(userProductRoutes)
 



const port = process.env.PORT || 1414
app.listen(port, async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
        console.log(`Server is listening on port ${port}`)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})