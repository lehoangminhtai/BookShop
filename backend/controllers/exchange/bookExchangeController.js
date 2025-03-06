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

const getBooksExchange = async (req, res) => {
    try {
        const books = await BookExchange.find();
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sách trao đổi' });
    }
};

const updateBookExchange = async (req, res) => {
    const { bookId } = req.params; // Lấy ID sách trao đổi cần cập nhật
    const { 
        title, author, description, images, publisher, categoryId, 
        condition, exchangeType, location, pageCount, publicationYear 
    } = req.body;

    const userId = req.userId;

    try {
        // Tìm sách theo bookId
        const bookExchange = await BookExchange.findById(bookId);

        if (!bookExchange) {
            return res.status(404).json({
                success: false,
                message: 'Sách trao đổi không tồn tại',
            });
        }

        // Kiểm tra xem có hình ảnh mới không, nếu có thì upload lên Cloudinary
        let imageUrls = bookExchange.images; // Giữ nguyên ảnh cũ nếu không có ảnh mới

        if (images) {
            if (Array.isArray(images)) {
                // Nếu images là một mảng, ta upload từng ảnh lên Cloudinary
                const uploadPromises = images.map((image) =>
                    cloudinary.uploader.upload(image, { folder: 'uploads' })
                );
                const uploadResults = await Promise.all(uploadPromises);
                imageUrls = uploadResults.map((result) => result.secure_url); // Lấy URL ảnh đã upload
            } else {
                // Nếu images chỉ là một ảnh đơn, ta upload lên Cloudinary
                const result = await cloudinary.uploader.upload(images, { folder: 'uploads' });
                imageUrls = [result.secure_url]; // Chỉ có một ảnh
            }
        }

        // Cập nhật thông tin sách trao đổi
        bookExchange.title = title || bookExchange.title;
        bookExchange.author = author || bookExchange.author;
        bookExchange.description = description || bookExchange.description;
        bookExchange.images = imageUrls; // Cập nhật danh sách ảnh mới (nếu có)
        bookExchange.publisher = publisher || bookExchange.publisher;
        bookExchange.categoryId = categoryId || bookExchange.categoryId;
        bookExchange.condition = condition || bookExchange.condition;
        bookExchange.exchangeType = exchangeType || bookExchange.exchangeType;
        bookExchange.location = location || bookExchange.location;
        bookExchange.pageCount = pageCount || bookExchange.pageCount;
        bookExchange.publicationYear = publicationYear || bookExchange.publicationYear;

        // Lưu sách đã cập nhật
        if (await bookExchange.save()) {
            await logAction(
                'Cập nhật sách trao đổi',
                userId,
                `Người dùng ${userId} đã cập nhật sách trao đổi: ${bookExchange.title}`,
                bookExchange
            );
        }

        // Trả về thông báo thành công cùng thông tin sách đã cập nhật
        res.status(200).json({
            success: true,
            message: 'Cập nhật sách trao đổi thành công',
            bookExchange,
        });

    } catch (error) {
        // Xử lý lỗi
        return res.status(400).json({
            success: false,
            message: 'Cập nhật sách trao đổi thất bại: ' + error.message,
        });
    }
};

module.exports = {
    createBookExchange,
    getBooksExchange,
    updateBookExchange
};
