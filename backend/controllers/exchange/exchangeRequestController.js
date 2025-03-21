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

const getExchangeRequestByBookRequested = async (req, res) => {
    try {
        const { bookRequestedId } = req.params;
        const listRequest = await ExchangeRequest.find({ bookRequestedId })
            .populate({
                path: 'exchangeBookId',
                match: { status: 'available' }
            })
            .populate('requesterId');

        // Lọc các yêu cầu mà exchangeBookId không null
        const filteredRequests = listRequest.filter(request => request.exchangeBookId);

        if (filteredRequests.length === 0) {
            return res.status(200).json({ success: false, message: "Chưa có yêu cầu nào gửi" });
        }

        return res.status(200).json({
            success: true,
            data: filteredRequests
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
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


module.exports = { createExchangeRequest, checkExchangeRequest, deleteRequest,getExchangeRequestByBookRequested, acceptExchangeRequest};
