
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const app = express()
const bookRoutes = require('./routes/bookroute');
const categoryBookRoutes = require('./routes/categoryBookRoute');
const userRoutes = require('./routes/userRoute');
const bookSaleRoutes = require('./routes/bookSaleRoute');
const cartRoutes = require('./routes/cartRoute')
const orderRoutes = require('./routes/orderRoute')
const discountRoutes = require('./routes/discountRoute')
const shippingRoutes = require('./routes/shippingRoute')
const zaloPayRoutes = require('./routes/zaloPayRoute')
const momoRoutes = require('./routes/momoRoute')
const paymentRoutes = require('./routes/paymentRoute')
const Payment = require('./models/paymentModel')

//connect database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('listen on port ', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error);
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
}));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api/books', bookRoutes);
app.use('/api/categoryBooks', categoryBookRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/bookSales', bookSaleRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/zalopay', zaloPayRoutes);
app.use('/api/momo', momoRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})



