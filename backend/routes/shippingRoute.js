const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');

router.post('/create', shippingController.createShipping)
// Route để thêm một tỉnh vào phí vận chuyển
router.post('/add-province', shippingController.addProvinceToShipping);

// Route để cập nhật phí vận chuyển của một tỉnh
router.put('/update-province', shippingController.updateProvinceShipping);

router.put('/update-shipping/:shippingId', shippingController.updateShipping);

// Route để lấy danh sách tất cả các phí vận chuyển
router.get('/', shippingController.getAllShippingFees);

router.get('/:provinceId', shippingController.getShippingFeeByProvinceId);

// Route để xóa một tỉnh khỏi phí vận chuyển
router.delete('/delete-province/:provinceId', shippingController.deleteProvinceFromShipping);

router.delete('/delete-shipping/:shippingId', shippingController.deleteShipping)

module.exports = router;
