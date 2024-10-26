
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    }

    // After 5 minutes, it will be deleted from database automatically
}, { timestamps: true })

module.exports = mongoose.model('OTP', otpSchema);
