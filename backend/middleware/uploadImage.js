const multer = require('multer');
const path = require('path');

// Thiết lập nơi lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Đặt tên file với thời gian hiện tại để tránh trùng lặp
    }
});

// Kiểm tra loại file upload (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
};

module.exports = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});
