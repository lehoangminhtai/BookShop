const express = require("express");
const { createExchangeInfor, getExchangeInfor } = require("../../controllers/exchange/exchangeInforController");

const router = express.Router();

router.post("/", createExchangeInfor);

router.get("/:requestId", getExchangeInfor);

module.exports = router;


