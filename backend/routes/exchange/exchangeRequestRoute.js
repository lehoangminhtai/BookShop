const express = require('express');
const { createExchangeRequest, acceptExchangeRequest } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();


router.post('/', createExchangeRequest);

router.post('/accept', acceptExchangeRequest);

module.exports = router;