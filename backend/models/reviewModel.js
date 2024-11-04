const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', // Liên kết với model Book
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Giới hạn rating từ 1 đến 5
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500 // Giới hạn độ dài comment
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
