const express = require('express');
const router = express.Router();

const momoController = require('../controllers/momo/momoController')

router.post('/payment', momoController.momoPayment)

router.post('/callback/:transactionId', momoController.momoCallback)

router.post('/check-status-order/:app_trans_id', momoController.check)

module.exports = router