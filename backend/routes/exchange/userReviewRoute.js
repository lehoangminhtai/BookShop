const express = require("express");
const { createUserReview, checkIfRequestIdExists, getReviewsByReviewedUser } = require("../../controllers/exchange/userReviewController");

const router = express.Router();

router.post("/", createUserReview);

router.get("/checkRequestId/:requestId/:userId", checkIfRequestIdExists);

router.get("/getReviewsByReviewedUser/:reviewedUserId", getReviewsByReviewedUser);

module.exports = router;