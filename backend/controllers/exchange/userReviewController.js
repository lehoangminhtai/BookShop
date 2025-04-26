const UserReview = require("../../models/exchange/userReviewModel");
const User = require("../../models/userModel");
const cloudinary = require("../../utils/cloudinary");

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


        res.status(201).json({ success: true, message: "Đánh giá đã được tạo thành công.", review: newReview });
    } catch (error) {
        console.error("Lỗi khi tạo đánh giá:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi tạo đánh giá." });
    }
};
const checkIfRequestIdExists = async (requestId) => {
    try {
        const review = await UserReview.findOne({ exchangeId: requestId });
        let exists = false;
        if (review) {
            exists = true;
        }
        res.status(201).json({ success: true, message: "Đánh giá đã được tạo thành công.", exist : exists });
    } catch (error) {
        console.error("Lỗi khi kiểm tra requestId:", error);
        throw new Error("Có lỗi khi kiểm tra requestId.");
    }
};

module.exports = {
    createUserReview, checkIfRequestIdExists
};