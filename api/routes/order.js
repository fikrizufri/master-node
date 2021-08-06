const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Handling Get request to /order"
    });
});
router.post('/', (req, res) => {
    const order = {
        productId: req.body.productId,
        qty :req.body.qty,
    };
    res.status(200).json({
        message: "Handling POST request to /order",
        order
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical order"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID"
        });
    }
});
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical order"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID 1"
        });
    }
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id === 'spesical') {
        res.status(200).json({
            message: "spesical order"
        });
    }else{
        res.status(200).json({
            message: "you passed in ID delete"
        });
    }
});

module.exports = router;