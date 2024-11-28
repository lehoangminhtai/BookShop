// models/shippingModel.js

const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    areaName:{
        type: String,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    provinces:[
        {
            provinceId:{
                type: Number,
            },
            provinceName: {
                type: String,
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Shipping', shippingSchema);
