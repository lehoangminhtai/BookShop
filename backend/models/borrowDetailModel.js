const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const borrowDetailSchema = new Schema({
    borrowId: {
        type: Schema.Types.ObjectId,
        ref: 'Borrow', // Liên kết với model Borrow
        required: true
    },
    bookBorrowId: {
        type: Schema.Types.ObjectId,
        ref: 'BookBorrow', // Liên kết với model BookBorrow
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('BorrowDetail', borrowDetailSchema);
