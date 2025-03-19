const { default: mongoose } = require('mongoose');
const cloudinary = require("../../utils/cloudinary");
const BookExchange = require("../../models/exchange/bookExchangeModel");
const { logAction } = require("../../middleware/logMiddleware.js");

const calculatePoints = ({ condition, publicationYear, pageCount, description, images }) => {
    let points = 0;
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - parseInt(publicationYear, 10);

    // 1. Điểm theo tình trạng sách
    const conditionPoints = {
        "new-unused": 7,
        "new-used": 5,
        "old-intact": 3,
        "old-damaged": 2
    };
    points += conditionPoints[condition] || 0;

    // 2. Điểm theo năm xuất bản
    if (yearDiff <= 1) points += 5;
    else if (yearDiff <= 5) points += 3;
    else if (yearDiff <= 10) points += 2;
    else points += 1;

    // 3. Điểm theo số trang
    if (pageCount >= 300) points += 7;
    else if (pageCount >= 200) points += 5;
    else if (pageCount >= 100) points += 3;
    else if (pageCount >= 5) points += 1;

    // 4. Điểm theo mô tả sách (nếu > 100 ký tự)
    if (description && description.length >= 100) points += 2;

    // 5. Điểm nếu có ảnh
    if (images && images.length > 0) points += 1;

    return points;
};

const createBookExchange = async (req, res) => {
    try {
        const { title, author, description, images, publisher, publicationYear, categoryId, condition, ownerId, location, pageCount } = req.body;
        let imageUrls = [];

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


        // Tính điểm dựa trên dữ liệu gửi lên
        const creditPoints = calculatePoints({ condition, publicationYear, pageCount, description, images });

        // Tạo sách trao đổi mới
        const newBookExchange = await BookExchange.create({
            title, author, description, images: imageUrls, publisher,
            publicationYear, categoryId, condition, creditPoints,
            ownerId, location, pageCount, status: "available",
        });

        // Ghi log hành động
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

const getBooksExchanges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
        const limit = parseInt(req.query.limit) || 8; // Số sách mỗi trang (mặc định là 8)
        const skip = (page - 1) * limit; // Tính số lượng sách cần bỏ qua

        const totalBooks = await BookExchange.countDocuments(); // Tổng số sách
        const books = await BookExchange.find().skip(skip).limit(limit).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: books,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks,
                hasNextPage: page * limit < totalBooks,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sách trao đổi' });
    }
};


const getBooksExchange = async (req, res) => {
    const { bookExchangeId } = req.params;
    try {
        const bookExchange = await BookExchange.findById(bookExchangeId);
        if (!bookExchange) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách trao đổi' });
        }
        res.status(200).json({ success: true, bookExchange });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy sách trao đổi' });
    }
}

const updateBookExchange = async (req, res) => {
    const { bookId } = req.params; // Lấy ID sách trao đổi cần cập nhật
    const {
        title, author, description, images, publisher, categoryId,
        condition, location, pageCount, publicationYear
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
const deleteBookExchange = async (req, res) => {
    const { bookId } = req.params; // Lấy ID sách cần xóa

    try {
        // Tìm sách trao đổi theo ID
        const bookExchange = await BookExchange.findById(bookId);

        if (!bookExchange) {
            return res.status(404).json({
                success: false,
                message: 'Sách trao đổi không tồn tại',
            });
        }

        // Xóa tất cả ảnh trên Cloudinary trước khi xóa sách
        if (bookExchange.images && bookExchange.images.length > 0) {
            const deleteImagePromises = bookExchange.images.map((imageUrl) => {
                // Lấy public_id từ URL của Cloudinary
                const publicId = imageUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(`uploads/${publicId}`);
            });

            await Promise.all(deleteImagePromises);
        }

        // Xóa sách trao đổi khỏi database
        await BookExchange.findByIdAndDelete(bookId);

        res.status(200).json({
            success: true,
            message: 'Xóa sách trao đổi thành công',
        });

    } catch (error) {
        // Xử lý lỗi
        return res.status(400).json({
            success: false,
            message: 'Xóa sách trao đổi thất bại: ' + error.message,
        });
    }
};

const getExchangeBookByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const bookExchanges = await BookExchange.find({ ownerId: userId });
        res.status(200).json({ success: true, bookExchanges });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sách trao đổi của người dùng' });
    }
};
const getExchangeBookAvailableByUser = async (req, res) => {
    const { userId } = req.params;
    const { categoryId } = req.query; // Lấy categoryId từ query params (nếu có)
    try {
        const filter = { ownerId: userId, status: "available" };
        if (categoryId) {
            filter.categoryId = categoryId; // Thêm điều kiện lọc nếu có categoryId
        }

        const bookExchanges = await BookExchange.find(filter);

        if (bookExchanges.length === 0) {
            return res.status(200).json({ success: false, message: "Không tìm thấy sách trao đổi nào" });
        }

        res.status(200).json({ success: true, bookExchanges });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sách trao đổi của người dùng: " + error.message });
    }
};


module.exports = {
    createBookExchange,
    getBooksExchanges,
    getBooksExchange,
    updateBookExchange,
    deleteBookExchange,
    getExchangeBookByUser,
    getExchangeBookAvailableByUser
};
