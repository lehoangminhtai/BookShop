const express = require('express');
const { createBookSale, getBookSale, getBookSales, deleteBookSale, updateBookSale } = require('../controllers/bookSaleController');


const router = express.Router();

// Lấy tất cả các sách đang bán
router.get('/', getBookSales);

// Lấy một sách bán cụ thể
router.get('/:bookId', getBookSale);

// Thêm sách bán mới
router.post('/', createBookSale);

// Xóa sách bán theo ID
router.delete('/:id', deleteBookSale);

// Cập nhật sách bán theo ID (nếu cần)
router.patch('/:id', updateBookSale);

module.exports = router;
