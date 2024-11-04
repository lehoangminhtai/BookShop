const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartDetailSchema = new Schema({
    bookSaleId: {
        type: Schema.Types.ObjectId,
        ref: 'BookSale', // Liên kết với model BookSale
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart', // Liên kết với model Cart
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrices: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CartDetail', cartDetailSchema);
