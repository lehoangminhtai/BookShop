const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const { updatePoints } = require('../controllers/exchange/pointHistoryController.js');

const Notification = require("../models/notificationModel");
const { io, getReceiverSocketId } = require("../utils/socket.js");


// Thêm đánh giá
const createReview = async (req, res) => {
    const { userId, bookId, orderId, rating, comment } = req.body;

    try {
        const review = new Review({ userId, bookId, orderId, rating, comment });
        await review.save();

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


module.exports = {
    createReview,
    getReviewsByBook,
    deleteReview,
    getReviewsByUser, // Thêm hàm vào danh sách export
};