const PointHistory = require('../../models/exchange/pointHistoryModel');

const updatePoints = async (userId, pointChange, type, description) => {

    await PointHistory.create({
        userId,
        points: pointChange,
        type,
        description
    });
};

const getPointHistory = async (req, res) => {
    const { userId } = req.params;
    const { type } = req.query;

    const filter = { userId };

    if (type) {
        filter.type = type;
    }

    try {
        const pointHistory = await PointHistory.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, pointHistory });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi tải lịch sử điểm", error: error.message });
    }
};

module.exports = {
    updatePoints,
    getPointHistory
};
