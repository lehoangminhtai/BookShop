
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const {app, server} = require('./utils/socket');
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
const reviewRoute = require('./routes/reviewRoute');
const accountRoute = require('./routes/accountRoute');
const addressRoutes = require('./routes/addressRoute');
const reportRoutes = require('./routes/reportRoute');
const logRoutes = require('./routes/logRoute');

//exchange
const bookExchangeRoutes = require('./routes/exchange/bookExchangeRoute');
const exchangeRequestRoutes = require('./routes/exchange/exchangeRequestRoute');
const exchangeInforRoutes = require('./routes/exchange/exchangeInforRoute');
const messageRoutes = require('./routes/exchange/messageRoute');
const reportExchangeRoutes = require('./routes/exchange/reportRoute');
const pointHistoryRoutes = require('./routes/exchange/pointHistoryRoute');

//AI
const summarizeBookRoutes = require('./routes/AI/summarizeBookRoute')
const userReviewRoutes = require('./routes/exchange/userReviewRoute');
const interactionRoutes = require('./routes/suggestion/interactionRoute');

//connect database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log('listen on port ', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error);
    })


app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
}));
app.use(express.json());
app.use(cors({ origin:[ 'http://localhost:3000', 'https://bookshop-vn.onrender.com'] }));
app.use('/api/books', bookRoutes);
app.use('/api/categoryBooks', categoryBookRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/bookSales', bookSaleRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/shippings', shippingRoutes);
app.use('/api/zalopay', zaloPayRoutes);
app.use('/api/momo', momoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoute);
app.use('/api/account', accountRoute);
app.use('/api/user/addresses', addressRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/logs', logRoutes);


//exchange
app.use('/api/book-exchange', bookExchangeRoutes);
app.use('/api/exchange-requests', exchangeRequestRoutes);
app.use('/api/exchange-infor', exchangeInforRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/report_exchange', reportExchangeRoutes);
app.use('/api/point-history', pointHistoryRoutes);

//AI
app.use('/api/summarize', summarizeBookRoutes)
app.use('/api/user-reviews', userReviewRoutes);
app.use('/api/interaction', interactionRoutes);

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})



