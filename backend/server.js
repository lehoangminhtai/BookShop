
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
//const imageRoute = require('./routes/image');
//const signRoute = require('./routes/signupload');

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

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '100mb',
    extended: true
}));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/api/books', bookRoutes);
app.use('/api/categoryBooks', categoryBookRoutes);
app.use('/api/admin/users', userRoutes);
//app.use('/api/image', imageRoute);
//app.use('/api/sign-upload', signRoute);


app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})



