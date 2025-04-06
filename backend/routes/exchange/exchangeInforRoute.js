const express = require("express");
const { createExchangeInfor, getExchangeInfor, updateExchangeInfor } = require("../../controllers/exchange/exchangeInforController");

const router = express.Router();

router.post("/", createExchangeInfor);

router.get("/:requestId", getExchangeInfor);

router.put("/update/:requestId", updateExchangeInfor);

module.exports = router;


