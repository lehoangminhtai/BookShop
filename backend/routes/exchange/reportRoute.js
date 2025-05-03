const express = require("express");
const router = express.Router();
const {createReport, getRequestByIdTelegram} = require('../../controllers/exchange/reportController')

router.post("/send", createReport);

router.post('/telegram-webhook',getRequestByIdTelegram)

module.exports = router;
