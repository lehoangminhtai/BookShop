const express = require('express');
const { createExchangeRequest, checkExchangeRequest, deleteRequest,
     getExchangeRequestByBookRequested, acceptExchangeRequest, getExchangeRequestsByRequester,
     cancelExchangeRequest, getExchangeRequestById } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();

router.get('/get-requests/:bookRequestedId', getExchangeRequestByBookRequested)
router.post('/', createExchangeRequest);
router.post("/check-exchange-request", checkExchangeRequest);
router.delete('/delete/:bookRequestedId', deleteRequest)
router.post('/accept', acceptExchangeRequest);
router.get('/requests/:userId', getExchangeRequestsByRequester);
router.post('/cancel/:requestId', cancelExchangeRequest);
router.get('/request/:requestId', getExchangeRequestById);

module.exports = router;