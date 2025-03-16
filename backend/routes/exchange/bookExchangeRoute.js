const express = require("express");
const { createBookExchange, getBooksExchange, getBooksExchanges, updateBookExchange, deleteBookExchange, getExchangeBookByUser } = require("../../controllers/exchange/bookExchangeController");

const router = express.Router();

// Route thêm sách mới để trao đổi
router.post("/", createBookExchange);
router.get("/", getBooksExchanges);
router.get("/:bookExchangeId", getBooksExchange);
router.put("/:bookId", updateBookExchange);
router.delete("/:bookId", deleteBookExchange);
router.get("/user/:userId", getExchangeBookByUser);
module.exports = router;


