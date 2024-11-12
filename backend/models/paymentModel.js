const paymentSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['zalopay', 'cash', 'vnpay', 'momo'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'canceled']
    },
    finalAmount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    checksum: {
        type: String,
        required: false
    },
    mac: {
        type: String,
        required: false
    }
});
