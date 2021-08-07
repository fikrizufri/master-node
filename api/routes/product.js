const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

//configuration multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/img');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') {
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


const Products = require('../models/product');

router.get('/', (req, res, next) => {
    Products.find()
        .select('name price _id productImage')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                product: result.map(item => {
                    return {
                        name: item.name,
                        price: item.price,
                        productImage: item.productImage,
                        _id: item._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + item._id
                        }
                    }
                })
            };
            res.status(200).json({
                message: "success",
                response
            });
        }).catch(error => {
            res.status(500).json({
                message: error
            });
        });

});
router.post('/', upload.single('productImage'), (req, res) => {
    const saveproduct = new Products({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    saveproduct.save().then(result => {
        res.status(201).json({
            message: "Save product succesfully",
            response: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(error => {
        res.status(400).json({
            message: "Save product failed",
            error
        });
    });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Products.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(result => {
            const response = {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
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
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Products.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            const response = {
                message: "Product updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            };
            res.status(200).json({
                response
            });
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Products.deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    data: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        }).catch(error => {
            res.status(500).json({
                message: error
            });
        });
});

module.exports = router;