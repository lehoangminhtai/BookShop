const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

// Route để thêm một tỉnh vào phí vận chuyển
router.post('/', shippingController.addProvinceToShipping);

// Route để cập nhật phí vận chuyển của một tỉnh
router.put('/', shippingController.updateProvinceShipping);

// Route để lấy danh sách tất cả các phí vận chuyển
router.get('/all', shippingController.getAllShippingFees);

router.get('/:provinceId', shippingController.getShippingFeeByProvinceId);

// Route để xóa một tỉnh khỏi phí vận chuyển
router.delete('/delete-province/:provinceId', shippingController.deleteProvinceFromShipping);

module.exports = router;
