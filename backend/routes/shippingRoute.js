const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const auth = require('../middleware/auth')

router.post('/create',auth, shippingController.createShipping)
// Route để thêm một tỉnh vào phí vận chuyển
router.post('/add-province',auth, shippingController.addProvinceToShipping);

// Route để cập nhật phí vận chuyển của một tỉnh
router.put('/update-province',auth, shippingController.updateProvinceShipping);

router.put('/update-shipping/:shippingId',auth, shippingController.updateShipping);

// Route để lấy danh sách tất cả các phí vận chuyển
router.get('/', shippingController.getAllShippingFees);

router.get('/:provinceId', shippingController.getShippingFeeByProvinceId);

// Route để xóa một tỉnh khỏi phí vận chuyển
router.delete('/delete-province/:provinceId',auth, shippingController.deleteProvinceFromShipping);

router.delete('/delete-shipping/:shippingId', auth, shippingController.deleteShipping)

module.exports = router;
