const User = require('../models/userModel')
const cloudinary = require("../utils/cloudinary");

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
        const { userId } = req.params; // Lấy user ID từ params
        const { fullName, phone, image, dateOfBirth } = req.body;

        // Kiểm tra xem user có tồn tại không
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

 

        let updatedImage = existingUser.image; // Giữ nguyên hình ảnh cũ nếu không có thay đổi
        if (image) {
            // Kiểm tra nếu URL đã thuộc Cloudinary thì không cần upload
            if (image.startsWith("https://res.cloudinary.com")) {
                updatedImage = image; // Giữ nguyên URL hình ảnh
            } else {
                // Nếu là hình ảnh mới, upload lên Cloudinary
                const result = await cloudinary.uploader.upload(image, {
                    folder: "uploads",
                });
                updatedImage = result.secure_url;
            }
        }


        // Cập nhật thông tin user
        existingUser.fullName = fullName || existingUser.fullName;
        existingUser.phone = phone || existingUser.phone;
        existingUser.image = updatedImage;
        existingUser.dateOfBirth = dateOfBirth || existingUser.dateOfBirth;

        // Lưu thông tin đã cập nhật
        await existingUser.save()

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin người dùng thành công',
            user: {
                _id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                image: existingUser.image,
                dateOfBirth: existingUser.dateOfBirth,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trong quá trình cập nhật người dùng' });
    }
};
exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy user ID từ params

        // Kiểm tra xem user có tồn tại không
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        res.status(200).json({
            success: true,
            user: existingUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trong quá trình cập nhật người dùng' });
    }
};
