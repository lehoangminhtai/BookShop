const mongoose = require('mongoose');

const ExchangeInforSchema = new mongoose.Schema({
  fullName_owner: {
    type: String,
    required: true,
  },
  fullName_requester: {
    type: String,
    
  },
  transactionLocation: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true
  },
  transactionTime: {
    type: String,
    required: true
  },
  deliveryMethod: {
    type: String,
    required: true,
  },
  contactPhone_owner: {
    type: String,
    required: true,
    match: /^[0-9]{10,11}$/ // Kiểm tra số điện thoại hợp lệ
  },
  contactPhone_requester : {
    type: String,
    match: /^[0-9]{10,11}$/ // Kiểm tra số điện thoại hợp lệ
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExchangeRequest',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ExchangeInfor', ExchangeInforSchema);
