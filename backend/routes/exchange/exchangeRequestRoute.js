const express = require('express');
const { createExchangeRequest, checkExchangeRequest, deleteRequest } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();


router.post('/', createExchangeRequest);
router.post("/check-exchange-request", checkExchangeRequest);
router.delete('/delete/:bookRequestedId', deleteRequest)

module.exports = router;