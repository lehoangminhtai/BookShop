const Payment = require('../models/paymentModel');

// Tạo thanh toán mới
exports.createPayment = async (req, res) => {
    try {
        const { transactionId, orderId, userId, paymentMethod, finalAmount } = req.body;

        const newPayment = new Payment({
            transactionId,
            orderId,
            userId,
            paymentMethod,
            finalAmount
        });

        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment', error: error.message });
    }
};

// Lấy thông tin thanh toán dựa trên transactionId
exports.getPaymentByTransactionId = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
};

exports.getPaymentByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await Payment.findOne({ orderId: orderId })
        .populate('orderId') 
        .populate('userId'); 

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error: error.message });
    }
};

// Lấy danh sách thanh toán của người dùng
exports.getUserPayments = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await Payment.find({ userId });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user payments', error: error.message });
    }
};

// Cập nhật trạng thái thanh toán
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { paymentStatus,finalAmount } = req.body;

        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { paymentStatus: paymentStatus, finalAmount :finalAmount},
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment status updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
        const skip = (page - 1) * limit;

        // Lấy danh sách thanh toán có phân trang
        const payments = await Payment.find({})
            .sort({ paymentDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'orderId',
                select: 'address orderStatus finalAmount'
            })
            .populate({
                path: 'userId',
                select: 'fullName email phone'
            });

        // Tính tổng số đơn hàng
        const totalPayments = await Payment.countDocuments();
        const totalPages = Math.max(Math.ceil(totalPayments / limit), 1);

        res.status(200).json({
            success: true,
            data: payments,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalPayments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
