const mongoose = require("mongoose");

const bookExchangeSchema = new mongoose.Schema({

    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    publisher: { type: String },
    publicationYear: { type: Number },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    condition: {
        type: String,
        required: true,
    },
    creditPoints: { type: Number }, // Chỉ áp dụng khi exchangeType là "Dùng điểm"
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
        type: String,
        default: "available",
    },
    location: {
        type: String,
        required: true,
    },
    pageCount: { type: Number, required: true },
}, { timestamps: true }
);

const BookExchange = mongoose.model("BookExchange", bookExchangeSchema);
module.exports = BookExchange;
