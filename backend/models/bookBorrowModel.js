const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookBorrowSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', // Liên kết với model Book
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Số lượng ít nhất là 1
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Giá không âm
    }
}, { timestamps: true });

module.exports = mongoose.model('BookBorrow', bookBorrowSchema);
