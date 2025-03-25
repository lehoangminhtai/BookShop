const express = require("express");
const { createExchangeInfor } = require("../../controllers/exchange/exchangeInforController");

const router = express.Router();

router.post("/", createExchangeInfor);

module.exports = router;


