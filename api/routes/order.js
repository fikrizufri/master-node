const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

const Orders = require('../models/order');
const Product = require('../models/product');

router.get("/", (req, res, next) => {
  Orders.find()
    .select("product quantity _id")
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        Orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            qty: doc.qty,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
        console.log(err);
      res.status(400).json({
        error: err
      });
    });
});

router.post('/', (req, res) => {

    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                res.status(400).json({
                    message: "Product Not Found"
                });
            }
            const saveorder = new Orders({
                _id: new mongoose.Types.ObjectId(),
                qty: req.body.qty,
                product: req.body.productId,
            });
            return saveorder.save();
        }).then(result => {
            res.status(201).json({
                message: "Save order succesfully",
                response: {
                    product: result.product,
                    qty: result.qty,
                    _id: result._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });

});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Orders.findById(id)
        .select('product qty _id')
        .populate('product', 'name')
        .exec()
        .then(result => {
            const response = {
                product: result.product,
                qty: result.qty,
                _id: result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            };
            if (result) {
                res.status(200).json({
                    response
                });
            } else {
                res.status(400).json({
                    message: "NO valid entry",
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Orders.deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order deleted",
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    data: { productId: 'Product', qty: 'Number'}
                }
            });
        }).catch(error => {
            res.status(500).json({
                message: error
            });
        });
});

module.exports = router;