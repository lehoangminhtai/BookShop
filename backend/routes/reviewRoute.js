const express = require('express');
const { createReview, getReviewsByBook, deleteReview, getReviewsByUser, checkReviewExistence } = require('../controllers/reviewController');

const router = express.Router();

// Route: Thêm đánh giá
router.post('/', createReview);

// Route: Lấy danh sách đánh giá của một cuốn sách
router.get('/:bookId', getReviewsByBook);

// Route: Xóa một đánh giá
router.delete('/:reviewId', deleteReview);


router.get('/account/:userId', getReviewsByUser);

router.get('/check-exist', checkReviewExistence);

module.exports = router;