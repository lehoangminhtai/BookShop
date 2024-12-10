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
