const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentItemSchema = new Schema({
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment', // Liên kết với model Payment
        required: true
    },
    cartDetailId: {
        type: Schema.Types.ObjectId,
        ref: 'CartDetail', // Liên kết với model CartDetail
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentItem', paymentItemSchema);
