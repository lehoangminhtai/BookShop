const express = require('express');
const { createExchangeRequest, acceptExchangeRequest, getExchangeRequestsByRequester } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();


router.post('/', createExchangeRequest);

router.post('/accept', acceptExchangeRequest);

router.get('/requests/:userId', getExchangeRequestsByRequester);

module.exports = router;