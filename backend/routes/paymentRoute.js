const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Tạo thanh toán mới
router.post('/', paymentController.createPayment);

router.get('/', paymentController.getAllPayments)

// Lấy thông tin thanh toán theo transactionId
router.get('/:transactionId', paymentController.getPaymentByTransactionId);

router.get('/order/:orderId', paymentController.getPaymentByOrderId);

// Lấy danh sách thanh toán của người dùng
router.get('/user/:userId', paymentController.getUserPayments);

// Cập nhật trạng thái thanh toán
router.patch('/:transactionId/status', paymentController.updatePaymentStatus);

module.exports = router;
