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


    res.status(201).json({ succes: true, message: 'Tạo giao dịch thành công', exchangeInfor: newExchangeInfor });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Lỗi khi tạo giao dịch', error: error.message });
  }
};

exports.getExchangeInfor = async (req, res) => {
  try {
    const {requestId} = req.params;
    if (requestId) {
      const existExchangeInfor = await ExchangeInfor.findOne({ requestId }).populate('requestId')
      
      if(existExchangeInfor){
        return res.status(200).json({ success: true, message: 'Lấy giao dịch thành công', exchangeInfor: existExchangeInfor });
      }
      return res.status(200).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }

  } catch (error) {
    
    res.status(500).json({ success: false, message: 'Lỗi khi lấy giao dịch', error: error.message });
  }
}

