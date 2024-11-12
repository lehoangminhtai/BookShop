const express = require('express');
const router = express.Router();

const zaloPayController = require('../controllers/zaloPay/zaloPayController')

router.post('/payment', zaloPayController.payment)

router.post('/callback/:transactionId', zaloPayController.callback)

router.post('/check-status-order/:app_trans_id',zaloPayController.checkStatusOrder)

module.exports = router