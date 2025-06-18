const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth')

// Tạo đơn hàng mới
router.post('/',auth, orderController.createOrder);

// Lấy đơn hàng theo ID
router.get('/:orderId', orderController.getOrderById);

// Lấy tất cả đơn hàng của người dùng
router.get('/user/:userId', orderController.getOrdersByUser);

// Cập nhật trạng thái đơn hàng
router.put('/:orderId',auth, orderController.updateOrderStatus);

// Cập nhật phương thức thanh toán
router.put('/:id/payment-method', orderController.updatePaymentMethod);

// Cập nhật trạng thái thanh toán khi đã thanh toán
router.put('/:id/payment-status', orderController.updatePaymentStatus);

router.post('/user/update-order', orderController.userUpdateOrder)

module.exports = router;
