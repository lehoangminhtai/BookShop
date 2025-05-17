const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointHistorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Liên kết với bảng User
    required: true
  },
  points: {
    type: Number, // Điểm cộng hoặc trừ
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend'], // Kiểu giao dịch (Cộng hoặc Trừ điểm)
    required: true
  },
  description: {
    type: String,
    default: '' // Mô tả về giao dịch điểm 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

module.exports = mongoose.model('PointHistory', pointHistorySchema);
