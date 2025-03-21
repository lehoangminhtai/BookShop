const express = require('express');
const { createExchangeRequest, checkExchangeRequest, deleteRequest, getExchangeRequestByBookRequested, acceptExchangeRequest } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();

router.get('/get-requests/:bookRequestedId', getExchangeRequestByBookRequested)
router.post('/', createExchangeRequest);
router.post("/check-exchange-request", checkExchangeRequest);
router.delete('/delete/:bookRequestedId', deleteRequest)
router.post('/accept', acceptExchangeRequest);

module.exports = router;