const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const BookExchange = require('../../models/exchange/bookExchangeModel');
const User = require('../../models/userModel');

const createExchangeRequest = async (req, res) => {
    try {
        const { bookRequestedId, exchangeMethod, exchangeBookId, requesterId } = req.body;

        const bookRequested = await BookExchange.findById(bookRequestedId);
        const user = await User.findById(requesterId);

        if (!bookRequested || !user) {
            return res.status(200).json({success:false, message: 'Sách hoặc người dùng không tồn tại' });
        }

        if (exchangeMethod === 'points') {
            if (user.grade < bookRequested.creditPoints) {
                return res.status(200).json({success:false, message: 'Điểm của người dùng không đủ để thực hiện trao đổi' });
            }
        }

        let exchangeBook = null;

        if (exchangeMethod === 'book') {
            if (!exchangeBookId) {
                return res.status(200).json({success:false, message: 'Vui lòng chọn sách để trao đổi' });
            }

            exchangeBook = await BookExchange.findById(exchangeBookId);

            if (!exchangeBook) {
                return res.status(200).json({success:false, message: 'Sách trao đổi không tồn tại' });
            }
            if (exchangeBook.status !=="available") {
                return res.status(200).json({success:false, message: 'Trạng thái sách trao đổi không hợp lệ' });
            }

            const totalPoints = exchangeBook.creditPoints + user.grade;

            if (exchangeBook.creditPoints < bookRequested.creditPoints && totalPoints < bookRequested.creditPoints) {
                return res.status(200).json({success:false, message: 'Tổng điểm của sách trao đổi và điểm của người dùng không đủ để thực hiện trao đổi' });
            }
        }
        const newRequest = new ExchangeRequest({
            bookRequestedId,
            exchangeMethod,
            exchangeBookId: exchangeMethod === 'book' ? exchangeBookId : null,
            requesterId,
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({success:true, data: savedRequest});
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: 'Lỗi khi tạo yêu cầu trao đổi' });
    }
};

module.exports = { createExchangeRequest };
