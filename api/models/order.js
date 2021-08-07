const  mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    qtyccc: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);