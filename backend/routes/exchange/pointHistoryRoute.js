const express = require("express");
const { getPointHistory } = require("../../controllers/exchange/pointHistoryController");

const router = express.Router();


router.get("/:userId", getPointHistory);

module.exports = router;