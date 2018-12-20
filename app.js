const express = require('express');
const app = express();
const morgan = require('morgan'); //morgan is for showing logs
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://node-shop:'+ process.env.MONGO_ATLAS_PW +'@cluster0-2tk7o.mongodb.net/test?retryWrites=true',{
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// for managing CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allo-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Methods', 'PUT, POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }
    next();
})

//Routes which should handle requests
app.use('/products', productRoutes); //middleware
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;