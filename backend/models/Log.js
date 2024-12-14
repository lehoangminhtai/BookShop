const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // Hành động (VD: "Add Book", "Login")
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID người dùng thực hiện
    description: { type: String }, // Mô tả chi tiết về hành động
    timestamp: { type: Date, default: Date.now }, // Thời gian thực hiện hành động
    metadata: { type: Object }, // Thông tin bổ sung (VD: ID sách, ID đơn hàng, v.v.)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
