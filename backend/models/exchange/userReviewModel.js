const mongoose = require("mongoose");

const userReviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exchangeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExchangeRequest",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  images: [{ type: String }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("UserReview", userReviewSchema);
