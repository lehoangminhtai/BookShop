const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSaleSchema = new Schema({
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book', // Liên kết với model Book
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0 
    },
    status: {
        type: String,
        enum: ['available', 'out_of_stock'],
        default: 'available'
    }
    
    
}, { timestamps: true });

module.exports = mongoose.model('BookSale', bookSaleSchema);
