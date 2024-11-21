const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy đơn hàng theo ID
router.get('/:orderId', orderController.getOrderById);

// Lấy tất cả đơn hàng của người dùng
router.get('/user/:userId', orderController.getOrdersByUser);

// Cập nhật trạng thái đơn hàng
router.put('/:orderId', orderController.updateOrderStatus);

// Cập nhật phương thức thanh toán
router.put('/:id/payment-method', orderController.updatePaymentMethod);

// Cập nhật trạng thái thanh toán khi đã thanh toán
router.put('/:id/payment-status', orderController.updatePaymentStatus);

module.exports = router;
