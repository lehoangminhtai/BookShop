const mongoose = require('mongoose');
const BookSale = require('./bookSaleModel');

const cartItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BookSale'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            // Sử dụng custom validator để lấy giá trị tồn kho từ BookSale
            validator: async function(value) {
                const book = await BookSale.findById(this.bookId);
                if (!book) {
                    throw new Error('Sách không tồn tại');
                }
                return value <= book.quantity;
            },
            message: 'Số lượng trong giỏ hàng vượt quá số lượng tồn kho'
        }
    },
    price:{
        type:Number,
        required: true,
        validate:{
            validator: async function(value) {
                const book = await BookSale.findById(this.bookId);
                if (!book) {
                    throw new Error('Sách không tồn tại');
                }
                return value = this.quantity * (book.price - (book.price * book.discount));
            },
            message: 'Giá tiền không hợp lệ'
        }
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    cartItems: [cartItemSchema], 
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware để cập nhật updatedAt trước khi lưu
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export model
const Cart = mongoose.model('Cart', cartSchema);
const CartItem = mongoose
module.exports = Cart;
