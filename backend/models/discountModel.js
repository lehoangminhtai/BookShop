const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discountSchema = new Schema({
    discountCode:{
        type: String,
        required: true
    },
    discountName: {
        type: String,
        required: true
    },
    discountDescription:{
        type:String,
        required: true
    },
    percent: {
        type: Number,
        required: true
    }
    ,
    minOfTotalPrice: {
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
