const express = require('express');
const router = express.Router();
const { handleBookClick, getLatestInteractions, updateInteractionWishlistOrCart } = require('../../controllers/suggestion/interactionController');

// Route cho việc xử lý khi người dùng click vào sách
router.post('/book-click', handleBookClick);

// Route lấy 100 tương tác gần nhất của người dùng
router.get('/suggestion', getLatestInteractions);

router.patch('/update/:userId/:bookId', updateInteractionWishlistOrCart);

module.exports = router;
