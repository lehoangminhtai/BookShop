const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/:userId", getNotifications);

router.patch("/read/:notificationId", markAsRead);

module.exports = router;
