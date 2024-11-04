const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    paymentMethod: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Thời gian thực hiện thanh toán
    },
    discountId: {
        type: Schema.Types.ObjectId,
        ref: 'Discount', // Liên kết với model Discount
        required: false
    },
    shippingId: {
        type: Schema.Types.ObjectId,
        ref: 'Shipping', // Liên kết với model Shipping
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
