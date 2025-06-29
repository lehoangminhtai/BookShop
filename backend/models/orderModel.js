const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    itemsPayment: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
            },
            bookTitle: {
                type: String,
                required: true
            },
            bookImage: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
        default: null
    },

    shippingFee: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirm', 'shipping', 'shipped', 'completed', 'failed'],
        default: 'pending'
    },

    deliveryAt: Date,
    url_checkout:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the `updatedAt` field on save
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
orderSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
    // Chỉ cập nhật trường `updatedAt` nếu có thay đổi gì đó
    this.set({ updatedAt: Date.now() });
    next();
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
