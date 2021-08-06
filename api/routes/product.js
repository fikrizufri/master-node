const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.status(200).json({
        message: "Handling Get request to /product"
    });
});
router.post('/', (req, res) => {
    console.log(req.body);
    const product = {
        name: req.body.name,
        price :req.body.price,
    };
    res.status(200).json({
        message: "Handling POST request to /product",
        product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical product"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID"
        });
    }
});
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical product"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID 1"
        });
    }
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical product"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID delete"
        });
    }
});

module.exports = router;