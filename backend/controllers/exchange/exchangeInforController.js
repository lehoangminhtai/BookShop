const ExchangeInfor = require('../../models/exchange/exchangeInforModel');
const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
exports.createExchangeInfor = async (req, res) => {
  try {
    const {
      fullName_owner,
      transactionLocation,
      transactionDate,
      transactionTime,
      deliveryMethod,
      contactPhone_owner,
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
      fullName_owner,
      fullName_requester:'',
      transactionLocation,
      transactionDate,
      transactionTime,
      deliveryMethod,
      contactPhone_owner,
      contactPhone_requester: '',
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

exports.updateExchangeInfor = async (req, res) => {
  try {
    const { requestId } = req.params; // Get the requestId from the URL params
    const {
      fullName_owner,
      fullName_requester,
      transactionLocation,
      transactionDate,
      transactionTime,
      deliveryMethod,
      contactPhone_owner,
      contactPhone_requester,
      notes,
    } = req.body;

    // Check if the exchange information exists
    const existExchangeInfor = await ExchangeInfor.findOne({ requestId });
    if (!existExchangeInfor) {
      return res.status(404).json({ success: false, message: 'Thông tin giao dịch không tồn tại' });
    }

    // Update the exchange information
    existExchangeInfor.fullName_owner = fullName_owner || existExchangeInfor.fullName_owner;
    existExchangeInfor.fullName_requester = fullName_requester || existExchangeInfor.fullName_requester;
    existExchangeInfor.transactionLocation = transactionLocation || existExchangeInfor.transactionLocation;
    existExchangeInfor.transactionDate = transactionDate || existExchangeInfor.transactionDate;
    existExchangeInfor.transactionTime = transactionTime || existExchangeInfor.transactionTime;
    existExchangeInfor.deliveryMethod = deliveryMethod || existExchangeInfor.deliveryMethod;
    existExchangeInfor.contactPhone_owner = contactPhone_owner || existExchangeInfor.contactPhone_owner;
    existExchangeInfor.contactPhone_requester = contactPhone_requester || existExchangeInfor.contactPhone_requester;
    existExchangeInfor.notes = notes || existExchangeInfor.notes;
    existExchangeInfor.status = 'accepted'; 


    // Save the updated exchange information
    await existExchangeInfor.save();

    res.status(200).json({ success: true, message: 'Cập nhật thông tin giao dịch thành công', exchangeInfor: existExchangeInfor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin giao dịch', error: error.message });
  }
};
