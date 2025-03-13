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

        if (exchangeMethod === 'points') {
            if (user.grade < bookRequested.creditPoints) {
                return res.status(400).json({ message: 'Điểm của người dùng không đủ để thực hiện trao đổi' });
            }
        }

        let exchangeBook = null;

        if (exchangeMethod === 'book') {
            if (!exchangeBookId) {
                return res.status(400).json({ message: 'Cần cung cấp exchangeBookId khi phương thức trao đổi là sách' });
            }

            exchangeBook = await BookExchange.findById(exchangeBookId);

            if (!exchangeBook) {
                return res.status(404).json({ message: 'Sách trao đổi không tồn tại' });
            }

            const totalPoints = exchangeBook.creditPoints + user.grade;

            if (exchangeBook.creditPoints < bookRequested.creditPoints && totalPoints < bookRequested.creditPoints) {
                return res.status(400).json({ message: 'Tổng điểm của sách trao đổi và điểm của người dùng không đủ để thực hiện trao đổi' });
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

module.exports = { createExchangeRequest };
