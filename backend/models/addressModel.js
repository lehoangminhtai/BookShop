const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addresses: [
        {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            street:
            {
                type: String,
                required: true
            },
            idWard: {
                type: Number,
                required: true
            },
            ward: {
                type: String,
                required: true
            },
            idDistrict: {
                type: Number,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            idProvince: {
                type: Number,
                required: true
            },
            province: {
                type: String,
                required: true
            },
            isDefault:{
                type: Boolean,
                default: false
            },
            createdAt: { type: Date, default: Date.now }
        }
    ]

}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;