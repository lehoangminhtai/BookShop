const express = require("express");
const { createUserReview, checkIfRequestIdExists } = require("../../controllers/exchange/userReviewController");

const router = express.Router();

router.post("/", createUserReview);

router.get("/checkRequestId/:requestId", checkIfRequestIdExists);

module.exports = router;