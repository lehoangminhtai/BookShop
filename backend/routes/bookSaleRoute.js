const express = require('express');
const { createBookSale, getBookSale, getBookSales, deleteBookSale, updateBookSale, getBookSalesAdmin, getBookSalesNotAvailable, searchBookSalesByTitle, getTopBooks, getLastBooks, searchBookSales, getBookSalesByCategory } = require('../controllers/bookSaleController');
const auth = require('../middleware/auth')

const router = express.Router();

// Lấy tất cả các sách đang bán
router.get('/', getBookSales);

router.get('/not-available', getBookSalesNotAvailable);

router.get('/admin', getBookSalesAdmin);

router.get('/search', searchBookSalesByTitle);

router.get('/search-home', searchBookSales);

router.get('/books-category', getBookSalesByCategory);

router.get('/top-books', getTopBooks);

router.get('/last-books', getLastBooks);

// Lấy một sách bán cụ thể
router.get('/:bookId', getBookSale);

// Thêm sách bán mới
router.post('/', createBookSale);

// Xóa sách bán theo ID
router.delete('/:id', deleteBookSale);

// Cập nhật sách bán theo ID (nếu cần)
router.patch('/:id',auth, updateBookSale);

module.exports = router;
