const Log = require('../models/Log')

exports.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const limit = parseInt(req.query.limit) || 10; // Số log mỗi trang
        const skip = (page - 1) * limit; // Bỏ qua bao nhiêu log

        const totalLogs = await Log.countDocuments(); // Tổng số log
        const logs = await Log.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'fullName email role');

        res.status(200).json({
            success: true,
            logs,
            totalLogs,
            totalPages: Math.ceil(totalLogs / limit) || 11, // Tổng số trang
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}