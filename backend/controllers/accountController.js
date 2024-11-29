const User = require('../models/userModel')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: 'Danh sách người dùng', users });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        res.status(200).json({ message: 'Cập nhật thông tin thành công!', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi!', error: error.message });
    }
};

