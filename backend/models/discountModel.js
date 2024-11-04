const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discountSchema = new Schema({
    discountName: {
        type: String,
        required: true
    },
    percent: {
        type: Number,
        required: true
    },
    dateStart: {
        type: Date,
        required: true
    },
    dateExpire: {
        type: Date,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
