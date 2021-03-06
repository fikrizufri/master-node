const express = require('express');
const app = express();
const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use('/assets',express.static('assets'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

mongoose.connect('mongodb://localhost:27017/admin', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;