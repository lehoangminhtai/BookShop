const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  content: { type: String, required: true },
  images: [{ type: String }],
  requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true
    },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ExchangeReport", reportSchema);
