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
                return res.status(200).json({success:false, message: 'Điểm của bạn không đủ để thực hiện trao đổi' });
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
                return res.status(200).json({success:false, message: 'Tổng điểm của sách trao đổi và điểm của bạn không đủ để thực hiện trao đổi' });
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
const checkExchangeRequest = async (req, res) => {
    try {
        const { bookRequestedId, requesterId } = req.body; 

        // Kiểm tra xem đã có yêu cầu trao đổi chưa
        const existingRequest = await ExchangeRequest.findOne({ 
            bookRequestedId, 
            requesterId 
        });

        if (existingRequest) {
            if(existingRequest.exchangeMethod === 'book' && existingRequest.exchangeBookId){
                const bookRequested = await BookExchange.findById(existingRequest.exchangeBookId)
                return res.status(200).json({ 
                    success: true, 
                    request: existingRequest,
                    book: bookRequested 
                });
            }
            return res.status(200).json({ 
                success: true, 
                request: existingRequest 
            });
        }

        return res.status(200).json({ success: false, message: "Chưa có yêu cầu nào được gửi" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi kiểm tra yêu cầu trao đổi" });
    }
};

const deleteRequest = async (req, res) =>{
    const {bookRequestedId} = req.params

    try {
        const request = await ExchangeRequest.findByIdAndDelete(bookRequestedId);

        if(!request){
            return res.status(200).json({success: false, message: "Yêu cầu không tồn tại"})
        }

        return res.status(200).json({success: true, message: "Đã xóa yêu cầu"})
    } catch (error) {
        
    }
}


module.exports = { createExchangeRequest, checkExchangeRequest, deleteRequest};
