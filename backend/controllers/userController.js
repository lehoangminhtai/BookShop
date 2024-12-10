const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const validator = require('validator');
const cloudinary = require("../utils/cloudinary");

exports.getAllUser = async (req,res) =>{
    try {
        const users = await User.find().sort({createdAt:-1})
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getFilterUser = async (req,res) =>{
    try {
        const {status} = req.body
        const users = await User.find({status: status}).sort({createdAt:-1})
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // Lấy giá trị từ query string

        // Tìm kiếm trong fullName, email hoặc phone
        const users = await User.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } }, // Không phân biệt chữ hoa/thường
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ]
        });

        return res.status(200).json({ success: true, users: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, phone,image, status, password, dateOfBirth, role } = req.body;
        if (!fullName || !email || !password || !phone) return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success:false, message: 'Email đã được sử dụng' });
        }
        let result = null
        if(image){
            result = await cloudinary.uploader.upload(image, {
                folder: "uploads",
               
            })
        }
        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 12);

        // Tạo mới User
        const newUser = new User({
            fullName,
            email,
            phone,
            image:image? result.secure_url  : undefined,
            status: status,
            password: hashedPassword,
            dateOfBirth,
            role: role
        });
        await newUser.generateAuthToken()
        await newUser.save();

        res.status(201).json({
            success:true,
            message: 'User được tạo thành công!',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                image: newUser.image,
                status: newUser.status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình tạo User' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy user ID từ params
        const { fullName, email, phone, image, status, dateOfBirth, role } = req.body;

        // Kiểm tra xem user có tồn tại không
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra email hợp lệ nếu có thay đổi
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email hợp lệ' });
        }

        // Kiểm tra nếu muốn thay đổi email đã tồn tại trong hệ thống
        if (email && email !== existingUser.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
            }
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
        existingUser.email = email || existingUser.email;
        existingUser.phone = phone || existingUser.phone;
        existingUser.image = updatedImage;
        existingUser.status = status !== undefined ? status : existingUser.status;
        existingUser.dateOfBirth = dateOfBirth || existingUser.dateOfBirth;
        existingUser.role = role ;

        // Lưu thông tin đã cập nhật
        await existingUser.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin người dùng thành công',
            user: {
                id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                image: existingUser.image,
                status: existingUser.status,
                dateOfBirth: existingUser.dateOfBirth,
                role: existingUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trong quá trình cập nhật người dùng' });
    }
};
