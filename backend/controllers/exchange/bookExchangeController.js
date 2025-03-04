const { default: mongoose } = require('mongoose');
const cloudinary = require("../../utils/cloudinary");
const BookExchange = require("../../models/exchange/bookExchangeModel");
const { logAction } = require("../../middleware/logMiddleware.js");

const createBookExchange = async (req, res) => {
    const {
        title, author, description, images, publisher,
        publicationYear, categoryId, condition,
        exchangeType, ownerId, location, pageCount
    } = req.body;

    try {
        let imageUrls = [];

        // Xử lý tải ảnh lên Cloudinary nếu có ảnh
        if (images) {
            if (Array.isArray(images)) {
                const uploadPromises = images.map(image => 
                    cloudinary.uploader.upload(image, { folder: "uploads" })
                );
                const uploadResults = await Promise.all(uploadPromises);
                imageUrls = uploadResults.map(result => result.secure_url);
            } else {
                const result = await cloudinary.uploader.upload(images, { folder: "uploads" });
                imageUrls.push(result.secure_url);
            }
        }

        const creditPoints = 0;
        // Tạo sách trao đổi mới
        const newBookExchange = await BookExchange.create({
            title, author, description, images: imageUrls, publisher,
            publicationYear, categoryId, condition, exchangeType, creditPoints,
            ownerId, location, pageCount, status: "available",
        });

        // Ghi log
        await logAction("Thêm sách trao đổi", ownerId, `Người dùng ${ownerId} đã thêm sách trao đổi: ${title}`);

        res.status(201).json({
            success: true,
            message: "Sách trao đổi đã được thêm thành công!",
            book: newBookExchange
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Thêm sách trao đổi thất bại: " + error.message
        });
    }
};

module.exports = {
    createBookExchange
};
