const express = require("express");
const {getMessages, getUsersForSidebar, sendMessage} = require("../../controllers/exchange/messageController");

const router = express.Router();

router.get("/users/:userId", getUsersForSidebar);
router.get("/:senderId/:receiverId", getMessages);

router.post("/send/:senderId/:receiverId", sendMessage);

module.exports = router;