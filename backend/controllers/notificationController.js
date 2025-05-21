const Notification = require("../models/notificationModel");

// Gửi và lưu 1 thông báo
const createNotification = async (req, res) => {
  try {
    const { senderId, receiverId, content, link, type } = req.body;

    const newNotification = new Notification({
      senderId,
      receiverId,
      content,
      link,
      type,
    });

    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi tạo thông báo", error });
  }
};

// Lấy danh sách thông báo của người dùng
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json( {success: true, notifications});
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy thông báo", error });
  }
};

// Đánh dấu đã đọc
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật thông báo", error });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};
