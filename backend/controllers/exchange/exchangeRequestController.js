const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const BookExchange = require('../../models/exchange/bookExchangeModel');
const User = require('../../models/userModel');

const createExchangeRequest = async (req, res) => {
    try {
        const { bookRequestedId, exchangeMethod, exchangeBookId, requesterId } = req.body;

        const bookRequested = await BookExchange.findById(bookRequestedId);
        const user = await User.findById(requesterId);

        if (!bookRequested || !user) {
            return res.status(200).json({ success: false, message: 'Sách hoặc người dùng không tồn tại' });
        }

        if (exchangeMethod === 'point') {
            if (user.grade < bookRequested.creditPoints) {
                return res.status(200).json({ success: false, message: 'Điểm của bạn không đủ để thực hiện trao đổi' });
            }
        }

        let exchangeBook = null;

        if (exchangeMethod === 'book') {
            if (!exchangeBookId) {
                return res.status(200).json({ success: false, message: 'Vui lòng chọn sách để trao đổi' });
            }

            exchangeBook = await BookExchange.findById(exchangeBookId);

            if (!exchangeBook) {
                return res.status(200).json({ success: false, message: 'Sách trao đổi không tồn tại' });
            }
            if (exchangeBook.status !== "available") {
                return res.status(200).json({ success: false, message: 'Trạng thái sách trao đổi không hợp lệ' });
            }

            const totalPoints = exchangeBook.creditPoints + user.grade;

            if (exchangeBook.creditPoints < bookRequested.creditPoints && totalPoints < bookRequested.creditPoints) {
                return res.status(200).json({ success: false, message: 'Tổng điểm của sách trao đổi và điểm của bạn không đủ để thực hiện trao đổi' });
            }
        }
        const newRequest = new ExchangeRequest({
            bookRequestedId,
            exchangeMethod,
            exchangeBookId: exchangeMethod === 'book' ? exchangeBookId : null,
            requesterId,
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({ success: true, data: savedRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi tạo yêu cầu trao đổi' });
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
            if (existingRequest.exchangeMethod === 'book' && existingRequest.exchangeBookId) {
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
            .populate('exchangeBookId')
            .populate('requesterId');


        const acceptedRequest = listRequest.find(request => request.status === 'accepted' || request.status === 'processing');

        if (acceptedRequest) {
            return res.status(200).json({
                success: true,
                data: acceptedRequest
            });
        }

        const filteredRequests = listRequest.filter(request => {
            if (request.exchangeMethod === 'book') {
                return request.exchangeBookId && request.exchangeBookId.status === 'available';
            } else if (request.exchangeMethod === 'points') {
                return true;
            }
        });

        return res.status(200).json({
            success: true,
            data: filteredRequests
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};


const deleteRequest = async (req, res) => {
    const { bookRequestedId } = req.params

    try {
        const request = await ExchangeRequest.findByIdAndDelete(bookRequestedId);

        if (!request) {
            return res.status(200).json({ success: false, message: "Yêu cầu không tồn tại" })
        }

        return res.status(200).json({ success: true, message: "Đã xóa yêu cầu" })
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
            return res.status(404).json({ success: false, message: 'Yêu cầu không tồn tại' });
        }

        if (bookRequested.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Sách yêu cầu không khả dụng' });
        }

        if (exchangeRequest.exchangeMethod === 'point') {
            if (requester.grade < bookRequested.creditPoints) {
                return res.status(400).json({ success: false, message: 'Điểm của người trao đổi không đủ' });
            }
            // requester.grade -= bookRequested.creditPoints;
            // await requester.save();
        }

        if (exchangeRequest.exchangeMethod === 'book') {
            const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
            if (!exchangeBook) {
                return res.status(404).json({ success: false, message: 'Sách trao đổi không tồn tại' });
            }

            if (exchangeBook.status !== 'available') {
                return res.status(400).json({ success: false, message: 'Sách trao đổi không khả dụng' });
            }

            const pointDifference = bookRequested.creditPoints - exchangeBook.creditPoints;

            if (pointDifference < 0) {
                if (user.grade < Math.abs(pointDifference)) {
                    return res.status(400).json({ success: false, message: 'Bạn không có đủ điểm để bù chênh lệch' });
                }
                //   user.grade += pointDifference;// cộng số âm
            } else if (pointDifference > 0) {
                if (requester.grade < pointDifference) {
                    return res.status(400).json({ success: false, message: 'Người trao đổi không có đủ điểm để bù chênh lệch' });
                }
                // requester.grade -= pointDifference;
                // await requester.save();
            }

            exchangeBook.status = 'processing';
            await exchangeBook.save();
        }

        exchangeRequest.status = 'accepted';
        bookRequested.status = 'processing';

        await exchangeRequest.save();
        await bookRequested.save();
        await user.save();

        res.status(200).json({ success: true, message: 'Yêu cầu trao đổi đã được chấp nhận' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi chấp nhận yêu cầu trao đổi' });
    }
};

const getExchangeRequestsByRequester = async (req, res) => {
    try {
        const { userId } = req.params;

        const requests = await ExchangeRequest.find({ requesterId: userId })

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy yêu cầu trao đổi' });
    }
}


const cancelExchangeRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const exchangeRequest = await ExchangeRequest.findById(requestId);
        if (!exchangeRequest) {
            return res.status(404).json({ success: false, message: 'Yêu cầu không tồn tại' });
        }



        const bookRequested = await BookExchange.findById(exchangeRequest.bookRequestedId);
        if (!bookRequested) {
            return res.status(404).json({ success: false, message: 'Sách yêu cầu không tồn tại' });
        }

        if (exchangeRequest.exchangeMethod === 'book') {
            const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
            if (!exchangeBook) {
                return res.status(404).json({ success: false, message: 'Sách trao đổi không tồn tại' });
            }
            exchangeBook.status = 'available';
            await exchangeBook.save();
        }

        // Reset the status of the book and the exchange request
        bookRequested.status = 'available';
        exchangeRequest.status = 'cancelled';

        await bookRequested.save();
        await exchangeRequest.save();

        res.status(200).json({ success: true, message: 'Yêu cầu trao đổi đã được hủy' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi hủy yêu cầu trao đổi' });
    }
};

const getExchangeRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await ExchangeRequest.findById(requestId).populate('bookRequestedId').populate('exchangeBookId')
        if (!request) {
            return res.status(200).json({ success: false });
        }
        return res.status(200).json({ success: true, data: request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy yêu cầu trao đổi' });
    }
}

const getExchangeRequestsByOwnerBook = async (req, res) => {
    try {
        const { userId } = req.params;

        // lấy tất cả các sách mà user là chủ sở hữu (ownerId)
        const userBooks = await BookExchange.find({ ownerId: userId });

        const userBookIds = userBooks.map(book => book._id);

        // Lấy tất cả yêu cầu mà cuốn sách được yêu cầu thuộc về user
        const requestsByOwner = await ExchangeRequest.find({
            bookRequestedId: { $in: userBookIds }
        })
        return res.status(200).json({ success: true, requests: requestsByOwner });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy yêu cầu trao đổi' });
    }
}

const getExchangeRequestsByUserId = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query;

    try {


        // B1: Lấy các request mà user là người gửi
        let requests = await ExchangeRequest.find({ requesterId: userId })


        // B2: Tìm các cuốn sách mà user là chủ sở hữu
        const userBooks = await BookExchange.find({ ownerId: userId });
        const userBookIds = userBooks.map(book => book._id);

        // B3: Lấy các request mà sách được yêu cầu là sách của user

        const requestsByOwner = await ExchangeRequest.find({ bookRequestedId: { $in: userBookIds } })

        // B4: Gộp 2 danh sách lại
        const allRequests = [...requests, ...requestsByOwner];

        res.status(200).json({ success: true, requests: allRequests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách yêu cầu trao đổi.' });
    }
};

const completeExchangeRequest = async (req, res) => {
    try {
        const { requestId, userId } = req.body;

        const exchangeRequest = await ExchangeRequest.findById(requestId);
        if (!exchangeRequest) {
            return res.status(404).json({ success: false, message: 'Yêu cầu không tồn tại' });
        }

        if (exchangeRequest.status === 'processing') {
            if (exchangeRequest.requesterId.toString() === userId) {
                exchangeRequest.status = 'requester_confirmed';
            }
            else {
                exchangeRequest.status = 'owner_confirmed';
            } // 1 bên đã xác nhận
        } else if (exchangeRequest.status === 'requester_confirmed' || exchangeRequest.status === 'owner_confirmed') {
            exchangeRequest.status = 'completed'; // hoàn tất giao dịch
        }
        else {
            return res.status(400).json({ success: false, message: 'Yêu cầu không thể hoàn tất' });
        }
        await exchangeRequest.save();

        if (exchangeRequest.status === 'completed') {
            const bookRequested = await BookExchange.findById(exchangeRequest.bookRequestedId);
            if (bookRequested) {
                bookRequested.status = 'completed';
                await bookRequested.save();
            }
            const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
            if (exchangeBook) {
                exchangeBook.status = 'completed';
                await exchangeBook.save();
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
                bookOwner.grade += bookRequested.creditPoints;
                await bookOwner.save();
            }
            if (exchangeRequest.exchangeMethod === 'book') {
                const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
                if (!exchangeBook) {
                    return res.status(404).json({ success: false, message: 'Sách trao đổi không tồn tại' });
                }

                const pointDifference = bookRequested.creditPoints - exchangeBook.creditPoints;

                if (pointDifference > 0) {
                    bookOwner.grade += pointDifference;
                    await bookOwner.save();
                } else if (pointDifference < 0) {
                    requester.grade -= pointDifference;// trừ số âm
                    await requester.save();
                }
            }

        }
        res.status(200).json({ success: true, message: 'Hoàn thành trao đổi thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi xác nhận hoàn thành trao đổi' });
    }
}

module.exports = {
    createExchangeRequest, checkExchangeRequest, deleteRequest,
    getExchangeRequestByBookRequested, acceptExchangeRequest, getExchangeRequestsByRequester,
    cancelExchangeRequest, getExchangeRequestById, getExchangeRequestsByOwnerBook, getExchangeRequestsByUserId, completeExchangeRequest
};
