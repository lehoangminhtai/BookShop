const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const BookSale = require('../models/bookSaleModel');
const Interaction = require('../models/suggestion/interactionModel');
const { updatePoints } = require('../controllers/exchange/pointHistoryController.js');

const Notification = require("../models/notificationModel");
const { io, getReceiverSocketId } = require("../utils/socket.js");



// Thêm đánh giá
const createReview = async (req, res) => {
    const { userId, bookId, orderId, rating, comment } = req.body;

    try {
        const review = new Review({ userId, bookId, orderId, rating, comment });
        await review.save();

        await handleBookClick(userId, bookId);


        let gradeIncrease = 1; // Mặc định
        if (comment && comment.trim().length > 0) gradeIncrease += 1;

        await User.findByIdAndUpdate(userId, { $inc: { grade: gradeIncrease } });
        await updatePoints(userId, gradeIncrease, 'earn', `Nhận điểm từ đánh giá sản phẩm`);

        const notification = await Notification.create({
            receiverId: userId,
            type: "point",
            content: `Bạn đã nhận ${gradeIncrease} điểm từ đánh giá sản phẩm.`,
            link: `/user-profile/${userId}`,
        });

        const receiverSocketId = getReceiverSocketId(userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getNotification", notification);
        }

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể thêm đánh giá', error });
    }
};

const handleBookClick = async (userId, bookId) => {

    try {
        const bookSale = await BookSale.findOne({ bookId });
        // Kiểm tra xem Interaction đã tồn tại chưa
        let interaction = await Interaction.findOne({ userId, bookId: bookSale._id }).sort({ last_visit_date: -1 });

        if (!interaction) {
            // Nếu chưa có Interaction, tạo mới
            const book = await BookSale.findById(bookId).populate('bookId'); // Populate để lấy thông tin categoryId từ model CategoryBook
            if (!book) {

            }


            // Tạo Interaction mới
            interaction = new Interaction({
                userId,
                bookId,
                categoryId: book.bookId.categoryId, // Lấy categoryId từ Book
                rating: null, // Chưa có rating ở đây
                click_count: 1,
            });

            // Kiểm tra nếu có rating cho book từ model Rating
            const rating = await Review.findOne({ userId, bookId }).sort({ createdAt: -1 });
            if (rating) {
                interaction.rating = rating.rating; // Gán rating từ model Rating vào Interaction
            }

            // Lưu Interaction mới
            await interaction.save();

        } else {

            // Cập nhật last_visit_date và tăng click_count lên 1
            interaction.last_visit_date = new Date();
            interaction.click_count += 1;

            const rating = await Review.findOne({ userId, bookId }).sort({ createdAt: -1 });
            if (rating) {
                interaction.rating = rating.rating; // Gán rating vào interaction
            }


            // Lưu lại Interaction đã cập nhật
            await interaction.save();

        }
    } catch (err) {
        console.error(err);
    }
};

// Lấy danh sách đánh giá cho một cuốn sách
const getReviewsByBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.find({ bookId }).populate('userId', 'fullName image');

        const averageRating = reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;

        const ratingCounts = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
            ratingCounts[review.rating - 1]++;
        });

        res.status(200).json({
            success: true,
            averageRating,
            ratingCounts,
            reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Không thể lấy danh sách đánh giá', error: error.message });

    }
};

// Xóa đánh giá
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
        }
        res.status(200).json({ success: true, message: 'Đánh giá đã được xóa' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể xóa đánh giá', error });
    }
};

// Lấy danh sách đánh giá của một người dùng
const getReviewsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const reviews = await Review.find({ userId }).sort({ createdAt: -1 })
            .populate('bookId', 'title images') // Lấy thông tin sách
            .populate('userId', 'fullName image'); // Lấy thêm thông tin người dùng

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng này chưa có đánh giá nào' });
        }

        res.status(200).json({
            success: true,
            reviews
        });
    } catch (error) {
        console.error('Error fetching reviews by user:', error);
        res.status(500).json({ success: false, message: 'Không thể lấy danh sách đánh giá của người dùng', error: error.message });
    }
};

const checkReviewExistence = async (req, res) => {
    try {
        const { userId, bookId, orderId } = req.body;

        if (!userId || !bookId || !orderId) {
            return res.status(400).json({ message: 'Thiếu thông tin userId, bookId hoặc orderId' });
        }

        const existingReview = await Review.findOne({
            userId,
            bookId,
            orderId
        });

        if (existingReview) {
            return res.status(200).json({ exists: true, review: existingReview });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server', error });
    }
};

module.exports = {
    createReview,
    getReviewsByBook,
    deleteReview,
    getReviewsByUser,
    checkReviewExistence
};