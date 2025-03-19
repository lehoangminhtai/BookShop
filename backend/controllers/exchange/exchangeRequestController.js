const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const BookExchange = require('../../models/exchange/bookExchangeModel');
const User = require('../../models/userModel');

const createExchangeRequest = async (req, res) => {
    try {
        const { bookRequestedId, exchangeMethod, exchangeBookId, requesterId } = req.body;

        const bookRequested = await BookExchange.findById(bookRequestedId);
        const user = await User.findById(requesterId);

        if (!bookRequested || !user) {
            return res.status(404).json({ message: 'Sách hoặc người dùng không tồn tại' });
        }

        if (exchangeMethod === 'point') {
            if (user.grade < bookRequested.creditPoints) {
                return res.status(400).json({ message: 'Điểm của người dùng không đủ để thực hiện trao đổi' });
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

        res.status(201).json(savedRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi tạo yêu cầu trao đổi' });
    }
};
const acceptExchangeRequest = async (req, res) => {
    try {
        const { requestId, userId } = req.body;

        const exchangeRequest = await ExchangeRequest.findById(requestId);
        const bookRequested = await BookExchange.findById(exchangeRequest.bookRequestedId);
        const user = await User.findById(userId);
        const requester = await User.findById(exchangeRequest.requesterId);


        if (!exchangeRequest || !bookRequested || !user || !requester) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại' });
        }

        if (bookRequested.status !== 'available') {
            return res.status(400).json({ message: 'Sách yêu cầu không khả dụng' });
          }

        if (exchangeRequest.exchangeMethod === 'point') {
            if (requester.grade < bookRequested.creditPoints) {
                return res.status(400).json({ message: 'Điểm của người trao đổi không đủđủ' });
              }
            requester.grade -= bookRequested.creditPoints;
            await requester.save();
        }

        if (exchangeRequest.exchangeMethod === 'book') {
            const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
            if (!exchangeBook) {
                return res.status(404).json({ message: 'Sách trao đổi không tồn tại' });
            }

            if (exchangeBook.status !== 'available') {
                return res.status(400).json({ message: 'Sách trao đổi không khả dụng' });
              }
              
            const pointDifference = bookRequested.creditPoints - exchangeBook.creditPoints;

            if (pointDifference < 0) {
                if (user.grade < Math.abs(pointDifference)) {
                    return res.status(400).json({ message: 'Bạn không có đủ điểm để bù chênh lệch' });
                }
                user.grade += pointDifference;
            } else if (pointDifference > 0) {
                if (requester.grade < pointDifference) {
                    return res.status(400).json({ message: 'Người trao đổi không có đủ điểm để bù chênh lệch' });
                }
                requester.grade -= pointDifference;
                await requester.save();
            }

            exchangeBook.status = 'pending';
            await exchangeBook.save();
        }

        exchangeRequest.status = 'approved';
        bookRequested.status = 'pending';

        await exchangeRequest.save();
        await bookRequested.save();
        await user.save();

        res.status(200).json({ message: 'Yêu cầu trao đổi đã được chấp nhận' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi chấp nhận yêu cầu trao đổi' });
    }
};

module.exports = { createExchangeRequest, acceptExchangeRequest };
