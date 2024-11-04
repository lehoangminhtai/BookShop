const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const borrowSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'canceled'], // Trạng thái có thể là pending, completed, hoặc canceled
        default: 'pending'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Borrow', borrowSchema);
