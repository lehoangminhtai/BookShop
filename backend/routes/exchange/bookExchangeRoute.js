const express = require("express");
const { createBookExchange, getBooksExchange, getBooksExchanges, 
    updateBookExchange, deleteBookExchange, getExchangeBookByUser, 
    getExchangeBookAvailableByUser, countUserExchanges, approvePostExchange  } = require("../../controllers/exchange/bookExchangeController");

const router = express.Router();

// Route thêm sách mới để trao đổi
router.post("/", createBookExchange);
router.get("/", getBooksExchanges);
router.get("/:bookExchangeId", getBooksExchange);
router.put("/:bookId", updateBookExchange);
router.delete("/:bookId", deleteBookExchange);
router.get("/user/:userId", getExchangeBookByUser);
router.get("/user/get-posts-available/:userId", getExchangeBookAvailableByUser);
router.get("/count-exchanges/:userId", countUserExchanges );
router.put("/approve-post-exchange/:bookId/:userId", approvePostExchange);
module.exports = router;


