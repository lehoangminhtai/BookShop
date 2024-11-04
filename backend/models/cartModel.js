const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
