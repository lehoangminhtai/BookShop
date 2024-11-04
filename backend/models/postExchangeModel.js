const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postExchangeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Liên kết với model User
        required: true
    },
    titlePost: {
        type: String,
        required: true
    },
    nameBook: {
        type: String,
        required: true
    },
    authorBook: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PostExchange', postExchangeSchema);
