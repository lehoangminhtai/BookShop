const express = require("express");
const router = express.Router();
const {createReport, getRequestByIdTelegram, getReports} = require('../../controllers/exchange/reportController')

router.post("/send", createReport);

router.post('/telegram-webhook',getRequestByIdTelegram)

router.get('/', getReports)

module.exports = router;
