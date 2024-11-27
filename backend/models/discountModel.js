const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discountSchema = new Schema({
    discountCode: {
        type: String,
        required: true
    },
    discountName: {
        type: String,
        required: true
    },
    discountDescription: {
        type: String,
        required: true
    },
    percent: {
        type: Number,  // Giảm giá theo % (dành cho giảm giá theo %)
        required: function() {
            return this.discountType === 'percentage'; // Chỉ yêu cầu khi là giảm giá theo phần trăm
        }
    },
    amount: {
        type: Number,  // Giảm giá theo số tiền (dành cho giảm giá theo tiền)
        required: function() {
            return this.discountType === 'amount'; // Chỉ yêu cầu khi là giảm giá theo số tiền
        }
    },
    maxAmountDiscount:{
        type: Number,
        required: false
    },
    minOfTotalPrice: {
        type: Number, // Điều kiện giá trị tối thiểu để áp dụng giảm giá
        required: false
    },
    maxUsage: {
        type: Number,  // Số lượng tối đa người có thể sử dụng mã giảm giá
        required: false
    },
    usedBy: [{
        userId:{
        type: Schema.Types.ObjectId,  // Lưu danh sách người dùng đã sử dụng mã giảm giá này
        ref: 'User'}
    }],
    dateStart: {
        type: Date,
        required: true
    },
    dateExpire: {
        type: Date,
        required: false,  // Nếu không có thời gian hết hạn, có thể để `null`
        default: null
    },
      discountType: {
        type: String,
        enum: ['percentage', 'amount'], // Loại giảm giá: theo phần trăm hoặc số tiền
        required: true
    },
    discountFor:{
        type: String,
        required: false,
        enum: ['customer'],
        default: null
    }
}, { timestamps: true });

discountSchema.pre('save', function(next) {
    if (!this.dateStart) {
        this.dateStart = new Date(); // Gán ngày hiện tại
    }
 
    next();
});

discountSchema.methods.incrementUsage = function(userId) {
    // Nếu không giới hạn số người sử dụng, không làm gì cả
    if (this.maxUsage === 0|| this.maxUsage == null || (this.maxUsage && this.usedBy.length < this.maxUsage)) {
        this.usedBy.push(userId);
        return this.save();
    } else {
        throw new Error('Đã hết số lượng mã giảm');
    }
};

module.exports = mongoose.model('Discount', discountSchema);