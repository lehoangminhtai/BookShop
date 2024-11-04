const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exchangeSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'PostExchange', // Liên kết với model PostExchange
        required: true
    },
    recipientUserId: { //ID của người nhận sách
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Thời gian thực hiện trao đổi
    }
}, { timestamps: true });

module.exports = mongoose.model('Exchange', exchangeSchema);
