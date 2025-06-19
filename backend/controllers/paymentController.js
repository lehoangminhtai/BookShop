const Payment = require('../models/paymentModel');
const mongoose = require('mongoose');

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
        const { paymentStatus, finalAmount } = req.body;

        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { paymentStatus: paymentStatus, finalAmount: finalAmount },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({success: true, message: 'Payment status updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
        const limit = parseInt(req.query.limit) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
        const skip = (page - 1) * limit;

        const searchKeyword = req.query.search ? req.query.search.trim().toLowerCase() : "";

        const query = [];

        if (searchKeyword) {
            query.push(
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                { $unwind: '$userInfo' }, // Quan trọng để tìm theo userInfo.fullName
                {
                    $match: {
                        $or: [
                            { 'userInfo.fullName': { $regex: searchKeyword, $options: 'i' } }, // Tìm theo tên
                            ...(mongoose.Types.ObjectId.isValid(searchKeyword)
                                ? [{ 'orderId': new mongoose.Types.ObjectId(searchKeyword) }]
                                : [])
                        ]
                    }
                }
            );
        }

        // Kiểm tra các query string từ client
        if (req.query.paymentStatus) {
            query.push({ $match: { paymentStatus: req.query.paymentStatus } });
        }

        if (req.query.paymentMethod) {
            query.push({ $match: { paymentMethod: req.query.paymentMethod } });
        }

        if (req.query.orderStatus) {
            query.push({
                $lookup: {
                    from: 'orders', // Tên collection của bảng Order
                    localField: 'orderId', // Trường `orderId` trong Payment
                    foreignField: '_id', // Trường `_id` trong Order
                    as: 'orderInfo' // Alias cho kết quả join
                }
            });
            query.push({ $unwind: '$orderInfo' }); // Đảm bảo mỗi payment chỉ có một order liên kết
            query.push({ $match: { 'orderInfo.orderStatus': req.query.orderStatus } }); // Lọc theo `orderStatus`
        }

        // Tìm danh sách thanh toán có phân trang
        const payments = await Payment.aggregate([
            ...query,
            { $sort: { paymentDate: -1 } }, // Sắp xếp theo ngày thanh toán giảm dần
            { $skip: skip }, // Phân trang: bỏ qua các bản ghi trước
            { $limit: limit }, // Giới hạn số bản ghi
            {
                $lookup: {
                    from: 'users', // Tên collection của bảng User
                    localField: 'userId', // Trường `userId` trong Payment
                    foreignField: '_id', // Trường `_id` trong User
                    as: 'userInfo' // Alias cho kết quả join
                }
            },
            {
                $lookup: {
                    from: 'orders', // Tên collection của bảng Order
                    localField: 'orderId', // Trường `orderId` trong Payment
                    foreignField: '_id', // Trường `_id` trong Order
                    as: 'orderInfo' // Alias cho kết quả join
                }
            },
            {
                $project: {
                    transactionId: 1,
                    orderId: { $arrayElemAt: ['$orderInfo', 0] }, // Lấy orderInfo duy nhất
                    userId: { $arrayElemAt: ['$userInfo', 0] }, // Lấy userInfo duy nhất
                    paymentMethod: 1,
                    paymentStatus: 1,
                    finalAmount: 1,
                    paymentDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]);

        // Tính tổng số thanh toán với các điều kiện tương tự
        const totalPaymentsResult = await Payment.aggregate([
            ...query,
            {
                $count: 'total' // Đếm số lượng thanh toán thỏa mãn điều kiện
            }
        ]);

        const totalPayments = totalPaymentsResult[0]?.total || 0; // Lấy tổng số thanh toán
        const totalPages = Math.max(Math.ceil(totalPayments / limit), 1); // Tính số trang

        res.status(200).json({
            success: true,
            data: payments,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalPayments
        });
    } catch (error) {
    console.error("Error in getAllPayments:", error); // Thêm dòng này
    res.status(500).json({ error: error.message });
}

};

exports.updateStatusPayment = async (req, res) => {
    try {
        const { paymentId, status } = req.body;

        const updatePayment = await Payment.findById(paymentId);
        updatePayment.paymentStatus = status
        await updatePayment.save();

        return res.status(200).json({ success: true, data: updatePayment });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePaymentZaloTransId = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { zp_trans_id } = req.body;

        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { zp_trans_id },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({success: true, message: 'Payment status updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};

