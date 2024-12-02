const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Thêm địa chỉ mới cho người dùng
router.post('/:userId', addressController.addAddress);

// Lấy tất cả địa chỉ của người dùng
router.get('/:userId', addressController.getAllAddresses);

// Cập nhật địa chỉ của người dùng
router.put('/:userId/:addressId', addressController.updateAddress);

// Xóa địa chỉ của người dùng
router.delete('/:userId/:addressId', addressController.deleteAddress);

module.exports = router;
