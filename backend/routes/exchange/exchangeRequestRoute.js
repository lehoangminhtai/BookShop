const express = require('express');
const { createExchangeRequest } = require('../../controllers/exchange/exchangeRequestController');

const router = express.Router();


router.post('/', createExchangeRequest);

module.exports = router;