const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'BookSale', // Liên kết với model Book
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryBook', 
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5 // Giới hạn rating từ 1 đến 5
    },
    last_visit_date: {
        type: Date,
        default: Date.now // Ngày truy cập gần nhất
    },
    click_count: {
        type: Number,
        min: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);