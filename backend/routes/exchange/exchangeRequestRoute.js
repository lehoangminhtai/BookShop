const express = require('express');
<<<<<<< HEAD
const { createExchangeRequest, acceptExchangeRequest } = require('../../controllers/exchange/exchangeRequestController');
=======
const { createExchangeRequest } = require('../../controllers/exchange/exchangeRequestController');
>>>>>>> origin/main

const router = express.Router();


router.post('/', createExchangeRequest);

<<<<<<< HEAD
router.post('/accept', acceptExchangeRequest);

=======
>>>>>>> origin/main
module.exports = router;