const ExchangeInfor = require('../../models/exchange/exchangeInforModel');
const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const BookExchange = require('../../models/exchange/bookExchangeModel');
const User = require('../../models/userModel');

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
      status
    } = req.body;

    // Check if the exchange information exists
    const exchangeRequest = await ExchangeRequest.findById(requestId);
    if (!exchangeRequest) {
      return res.status(404).json({ success: false, message: 'Yêu cầu trao đổi không tồn tại' });
    }
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
    existExchangeInfor.status = status || existExchangeInfor.status;

    await existExchangeInfor.save();

    if(status === 'accepted') {
      exchangeRequest.status = 'processing';
      await exchangeRequest.save();
    }
    
    // Save the updated exchange information

    // Calculate the points for bookOwner, requester
    const bookRequested = await BookExchange.findById(exchangeRequest.bookRequestedId);
    if (!bookRequested) {
      return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
    }
    const bookOwner = await User.findById(bookRequested.ownerId);
    if (!bookOwner) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }
    
    const requester = await User.findById(exchangeRequest.requesterId);
    if (!requester) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    if (exchangeRequest.exchangeMethod === 'point') {
      if (requester.grade < bookRequested.creditPoints) {
        return res.status(400).json({ success: false, message: 'Điểm của người trao đổi không đủ' });
      }
      requester.grade -= bookRequested.creditPoints;
      await requester.save();
    }
    if (exchangeRequest.exchangeMethod === 'book') {
      const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
      if (!exchangeBook) {
        return res.status(404).json({ success: false, message: 'Sách trao đổi không tồn tại' });
      }

      const pointDifference = bookRequested.creditPoints - exchangeBook.creditPoints;

      if (pointDifference < 0) {
        if (bookOwner.grade < Math.abs(pointDifference)) {
          return res.status(400).json({ success: false, message: 'Chủ sách không có đủ điểm để bù chênh lệch' });
        }
        bookOwner.grade += pointDifference;// cộng số âm
        await bookOwner.save();
      } else if (pointDifference > 0) {
        if (requester.grade < pointDifference) {
          return res.status(400).json({ success: false, message: 'Bạn không có đủ điểm để bù chênh lệch' });
        }
        requester.grade -= pointDifference;
        await requester.save();
      }
    }


    res.status(200).json({ success: true, message: 'Cập nhật thông tin giao dịch thành công', exchangeInfor: existExchangeInfor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật thông tin giao dịch', error: error.message });
  }
};
