const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

// Routes cho các hành động với discount
router.post('/', discountController.createDiscount);  // Tạo mã giảm giá
router.get('', discountController.getAllDiscounts);  // Lấy tất cả mã giảm giá
router.get('/:id', discountController.getDiscountById);  // Lấy mã giảm giá theo ID
router.put('/:id', discountController.updateDiscount);  // Cập nhật mã giảm giá
router.delete('/:id', discountController.deleteDiscount);  // Xóa mã giảm giá

module.exports = router;
