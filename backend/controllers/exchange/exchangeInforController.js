const ExchangeInfor = require('../../models/exchange/exchangeInforModel');
const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
exports.createExchangeInfor = async (req, res) => {
  try {
    const {
      fullName,
      transactionLocation,
      transactionDate,
      transactionTime,
      deliveryMethod,
      contactPhone,
      notes,
      requestId
    } = req.body;

    // Kiểm tra xem requestId có tồn tại trong ExchangeRequest không
    const exchangeRequest = await ExchangeRequest.findById(requestId);
    if (!exchangeRequest) {
      return res.status(404).json({ succes: false, message: 'Yêu cầu trao đổi không tồn tại' });
    }

    if (exchangeRequest.status !== 'accepted') {
      return res.status(400).json({ succes: false, message: 'Yêu cầu trao đổi chưa được chấp nhận' });
    }

    const newExchangeInfor = new ExchangeInfor({
      fullName,
      transactionLocation,
      transactionDate,
      transactionTime,
      deliveryMethod,
      contactPhone,
      notes,
      status: 'pending',
      requestId
    });

    await newExchangeInfor.save();

    // Cập nhật trạng thái của ExchangeRequest thành "processing"
    exchangeRequest.status = 'processing';
    await exchangeRequest.save();

    res.status(201).json({ succes: true, message: 'Tạo giao dịch thành công', exchangeInfor: newExchangeInfor });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Lỗi khi tạo giao dịch', error: error.message });
  }
};
