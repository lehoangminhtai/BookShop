const express = require("express");
const { createBookExchange, getBooksExchange, updateBookExchange, deleteBookExchange } = require("../../controllers/exchange/bookExchangeController");

const router = express.Router();

// Route thêm sách mới để trao đổi
router.post("/", createBookExchange);
router.get("/", getBooksExchange);
router.put("/:bookId", updateBookExchange);
router.delete("/:bookId", deleteBookExchange);
module.exports = router;


