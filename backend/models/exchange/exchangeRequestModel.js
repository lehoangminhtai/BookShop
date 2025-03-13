const mongoose = require('mongoose');
const { Schema } = mongoose;

const ExchangeRequestSchema = new Schema({
  bookRequestedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookExchange',
    required: true
  },
  exchangeMethod: {
    type: String,
    required: true
  },
  exchangeBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookExchange', // Cuốn sách dùng để trao đổi
    required: function() { return this.exchangeMethod === 'book'; }
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Người gửi yêu cầu
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ExchangeRequest', ExchangeRequestSchema);
