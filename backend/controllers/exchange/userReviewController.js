const UserReview = require("../../models/exchange/userReviewModel");
const User = require("../../models/userModel");
const cloudinary = require("../../utils/cloudinary");
const { updatePoints } = require('../exchange/pointHistoryController');

const createUserReview = async (req, res) => {
    try {
        const { reviewerId, reviewedUserId, exchangeId, rating, comment, images } = req.body;

        const existingReview = await UserReview.findOne({ reviewerId, reviewedUserId, exchangeId });
        if (existingReview) return res.status(400).json({ message: "Bạn đã đánh giá người này cho giao dịch này rồi." });

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

        const newReview = new UserReview({ reviewerId, reviewedUserId, exchangeId, rating, comment, images: imageUrls });
        await newReview.save();

        let gradeIncrease = 1; // Mặc định
        if (comment && comment.trim().length > 0) gradeIncrease += 1;
        if (imageUrls.length > 0) gradeIncrease += 1;

        await User.findByIdAndUpdate(reviewerId, { $inc: { grade: gradeIncrease } });
        await updatePoints(reviewerId, gradeIncrease, 'earn', `Nhận điểm từ đánh giá người dùng`);
            

        res.status(201).json({ success: true, message: "Đánh giá đã được tạo thành công.", review: newReview });
    } catch (error) {
        console.error("Lỗi khi tạo đánh giá:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi tạo đánh giá." });
    }
};
const checkIfRequestIdExists = async (req, res) => {
    const { requestId, userId } = req.params;
    try {
        const review = await UserReview.findOne({
            exchangeId: requestId,
            reviewerId: userId,
        });
        let exists = false;
        if (review) {
            exists = true;
        }
        res.status(200).json({
            success: true,
            exist: exists,
            message: exists
                ? "Người dùng đã đánh giá request này."
                : "Người dùng chưa đánh giá request này.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Có lỗi khi kiểm tra.",
        });
    }
};
const getReviewsByReviewedUser = async (req, res) => {
    const { reviewedUserId } = req.params;

    try {
        const reviews = await UserReview.find({ reviewedUserId })
            .populate('reviewerId', 'fullName image');

        const averageRating = reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : 0;

        const ratingCounts = [0, 0, 0, 0, 0]; // [1 sao, 2 sao, ..., 5 sao]
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
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách đánh giá người dùng',
            error: error.message
        });
    }
};
module.exports = {
    createUserReview, checkIfRequestIdExists, getReviewsByReviewedUser
};