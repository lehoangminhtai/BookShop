const { default: mongoose } = require('mongoose');
const cloudinary = require("../../utils/cloudinary");
const BookExchange = require("../../models/exchange/bookExchangeModel");
const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const { logAction } = require("../../middleware/logMiddleware.js");
const User = require("../../models/userModel");

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
            ownerId, location, pageCount, status: "pending",
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

        const query = {};

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i'); // 'i' = không phân biệt hoa thường
            query.$or = [
                { title: { $regex: searchRegex } },
                { author: { $regex: searchRegex } }
                // thêm field nào bạn muốn search
            ];
        }

        if (req.query.location) {
            query.location = req.query.location;
        }

        if (req.query.categoryId) {
            query.categoryId = req.query.categoryId;
        }

        if (req.query.condition) {
            query.condition = req.query.condition;
        }

        if (req.query.dateFilter) {
            const dateFilter = parseInt(req.query.dateFilter); // Lấy giá trị số ngày từ query
            const currentDate = new Date();
            const startDate = new Date(currentDate.setDate(currentDate.getDate() - dateFilter)); // Tính ngày bắt đầu từ ngày hiện tại trừ đi số ngày

            query.createdAt = {
                $gte: startDate // Lọc các sách có ngày tạo từ ngày bắt đầu
            };
        }

        if (req.query.status) {
            query.status = req.query.status;
        }

        const totalBooks = await BookExchange.countDocuments(query); // Tổng số sách
        const books = await BookExchange.find(query)
            .populate('ownerId', 'fullName email phone')
            .populate('categoryId', 'nameCategory')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

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
        const bookExchange = await BookExchange.findById(bookExchangeId).populate('ownerId');
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

const deleteAssociatedExchangeRequests = async (bookExchangeId) => {
    try {
        await ExchangeRequest.deleteMany({
            $or: [
                { bookRequestedId: bookExchangeId },
                { exchangeBookId: bookExchangeId }
            ]
        });
        console.log("Đã xóa các yêu cầu trao đổi liên quan.");
    } catch (error) {
        console.error("Lỗi khi xóa yêu cầu trao đổi liên quan:", error);
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
        const exchangeBook = await BookExchange.findByIdAndDelete(bookId);
        if (exchangeBook) {
            await deleteAssociatedExchangeRequests(bookId);
        }

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
        const query = {};

        query.ownerId = userId;

        if (req.query.categoryId) {
            query.categoryId = req.query.categoryId;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const bookExchanges = await BookExchange.find(query);
        if (bookExchanges.length === 0) {
            return res.status(200).json({ success: false, message: "Không tìm thấy sách trao đổi nào" });
        }
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

const countUserExchanges = async (req, res) => {
    // Đếm số lần trao đổi thành công của user và số bài đăng của useruser
    try {
        const { userId } = req.params;
        // Đếm số lượng giao dịch mà user là chủ sách và đã hoàn thành
        const ownerExchangesCount = await BookExchange.countDocuments({
            ownerId: userId,
            status: "completed",
        });
        // Đếm số lượng sách mà user là người nhận
        const receiverExchangesCount = await BookExchange.countDocuments({
            receiverId: userId,
            status: "completed",
        });
        // Tổng số lần trao đổi thành công
        const totalExchanges = ownerExchangesCount + receiverExchangesCount;

        // Đếm số bài đăng của user
        const totalPosts = await BookExchange.countDocuments({ ownerId: userId });

        res.status(200).json({ success: true, totalExchanges, totalPosts });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đếm số lần trao đổi", error });
    }
};

const approvePostExchange = async (req, res) => {
    const { bookId } = req.params;
    const { userId } = req.params;
    try {
        // Tìm sách theo bookId
        const bookExchange = await BookExchange.findById(bookId);

        if (!bookExchange) {
            return res.status(404).json({
                success: false,
                message: 'Sách trao đổi không tồn tại',
            });
        }
        const user = await User.findById(userId);
        if (!user || user.role !== 1) { // Giả sử role 1 là admin
            return res.status(403).json({ success: false, message: 'Bạn không có quyền duyệt sách trao đổi' });
        }
        if (bookExchange.status === "pending") {
            bookExchange.status = "available";
        }
        else {
            return res.status(400).json({ success: false, message: 'Sách trao đổi đã được duyệt hoặc không thể duyệt lại', });
        }
        await bookExchange.save();

        // Ghi log hành động
        await logAction(
            'Duyệt sách trao đổi',
            userId,
            `Người dùng ${userId} đã duyệt sách trao đổi: ${bookExchange.title}`,
            bookExchange
        );
        res.status(200).json({ success: true, message: 'Duyệt sách trao đổi thành công', bookExchange, });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Duyệt sách trao đổi thất bại: ' + error.message, });
    }
}

module.exports = {
    createBookExchange,
    getBooksExchanges,
    getBooksExchange,
    updateBookExchange,
    deleteBookExchange,
    getExchangeBookByUser,
    getExchangeBookAvailableByUser,
    countUserExchanges,
    approvePostExchange,
};
