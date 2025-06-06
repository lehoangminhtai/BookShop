const ExchangeRequest = require('../../models/exchange/exchangeRequestModel');
const BookExchange = require('../../models/exchange/bookExchangeModel');
const User = require('../../models/userModel');
const ExchangeInfor = require('../../models/exchange/exchangeInforModel');
const Notification = require("../../models/notificationModel");
const { updatePoints } = require('../exchange/pointHistoryController');
const { io, getReceiverSocketId } = require("../../utils/socket.js");

const createExchangeRequest = async (req, res) => {
    try {
        const { bookRequestedId, exchangeMethod, exchangeBookId, requesterId } = req.body;

        const bookRequested = await BookExchange.findById(bookRequestedId);
        const user = await User.findById(requesterId);

        if (!bookRequested || !user) {
            return res.status(200).json({ success: false, message: 'Sách hoặc người dùng không tồn tại' });
        }
        if (bookRequested.status !== 'available') {
            return res.status(200).json({ success: false, message: 'Sách không khả dụng để trao đổi' });
        }

        if (bookRequested.ownerId.toString() === requesterId) {
            return res.status(200).json({ success: false, message: 'Bạn không thể trao đổi sách của chính mình' });
        }

        if (exchangeMethod === 'points') {
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

        const notification_requester = await Notification.create({
            receiverId: requesterId,
            content: `Bạn đã gửi yêu cầu trao đổi cuốn sách "${bookRequested.title}".`,
            link: `/exchange/exchange-info-detail/${savedRequest._id}`,
            image: bookRequested.images[0],
        });

        const receiverSocketId_requester = getReceiverSocketId(requesterId);
        if (receiverSocketId_requester) {
            io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
        }

        const notification_owner = await Notification.create({
            receiverId: bookRequested.ownerId,
            content: `Bạn được gửi yêu cầu trao đổi cho cuốn sách "${bookRequested.title}".`,
            link: `/exchange/exchange-info-detail/${savedRequest._id}`,
            image: bookRequested.images[0],
            senderId: requesterId,
        })
        const receiverSocketId_owner = getReceiverSocketId(bookRequested.ownerId._id);
        if (receiverSocketId_owner) {
            io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
        }

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

        if (exchangeRequest.exchangeMethod === 'points') {
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

        const notification_owner = await Notification.create({
            receiverId: userId,
            content: `Bạn đã chấp nhận yêu cầu trao đổi cuốn sách "${bookRequested.title}".\nBạn cần điền thông tin giao dịch để tiếp tục quá trình trao đổi sách.`,
            link: `/exchange/exchange-info-detail/${requestId}`,
            image: bookRequested.images[0],
        });

        const receiverSocketId_owner = getReceiverSocketId(userId);
        if (receiverSocketId_owner) {
            io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
        }

        const notification_requester = await Notification.create({
            receiverId: requester._id,
            content: `Yêu cầu trao đổi cuốn sách "${bookRequested.title}" đã được chấp nhận.\nBạn cần chờ chủ cuốn sách điền thông tin giao dịch.`,
            link: `/exchange/exchange-info-detail/${requestId}`,
            image: bookRequested.images[0],
        });

        const receiverSocketId_requester = getReceiverSocketId(requester._id);
        if (receiverSocketId_requester) {
            io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
        }

        res.status(200).json({ success: true, message: 'Yêu cầu trao đổi đã được chấp nhận' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi khi chấp nhận yêu cầu trao đổi' });
    }
};

const getExchangeRequestsByRequester = async (req, res) => {
    try {
        const { userId } = req.params;

        const requests = await ExchangeRequest.find({ requesterId: userId }).sort({ createdAt: -1 });

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

        const exchangeInfor = await ExchangeInfor.findOne({ requestId: requestId });
        if (exchangeInfor) {
            await ExchangeInfor.findByIdAndDelete(exchangeInfor._id);
        }
        const notification_requester = await Notification.create({
            receiverId: exchangeRequest.requesterId,
            content: `Yêu cầu trao đổi cuốn sách "${bookRequested.title}" đã bị hủy.`,
            image: bookRequested.images[0],
        });
        const receiverSocketId_requester = getReceiverSocketId(exchangeRequest.requesterId);
        if (receiverSocketId_requester) {
            io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
        }
        const notification_owner = await Notification.create({
            receiverId: bookRequested.ownerId,
            content: `Yêu cầu trao đổi cuốn sách "${bookRequested.title}" đã bị hủy.`,
            image: bookRequested.images[0],
        });
        const receiverSocketId_owner = getReceiverSocketId(bookRequested.ownerId);
        if (receiverSocketId_owner) {
            io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
        }

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
        const requester = await User.findById(request.requesterId);
        const owner = await User.findById(request.bookRequestedId.ownerId);
        if (!request) {
            return res.status(200).json({ success: false });
        }
        return res.status(200).json({ success: true, data: request, requester, owner });
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
        }).sort({ createdAt: -1 });
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
        allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

        const bookRequested = await BookExchange.findById(exchangeRequest.bookRequestedId);
        if (!bookRequested) {
            return res.status(404).json({ success: false, message: 'Sách yêu cầu không tồn tại' });
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
        if (exchangeRequest.status === 'requester_confirmed') {
            const notification_requester = await Notification.create({
                receiverId: exchangeRequest.requesterId,
                content: `Bạn đã xác nhận hoàn tất giao dịch trao đổi cuốn sách "${bookRequested.title}". Vui lòng chờ chủ cuốn sách xác nhận.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_requester = getReceiverSocketId(exchangeRequest.requesterId);
            if (receiverSocketId_requester) {
                io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
            }

            const notification_owner = await Notification.create({
                receiverId: bookRequested.ownerId,
                content: `Người yêu cầu đã xác nhận hoàn tất giao dịch trao đổi cuốn sách "${bookRequested.title}". Bạn cần xác nhận để hoàn tất giao dịch và nhận điểm.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_owner = getReceiverSocketId(bookRequested.ownerId);
            if (receiverSocketId_owner) {
                io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
            }

        } else if (exchangeRequest.status === 'owner_confirmed') {
            const notification_owner = await Notification.create({
                receiverId: bookRequested.ownerId,
                content: `Bạn đã xác nhận hoàn tất giao dịch trao đổi cuốn sách "${bookRequested.title}". Vui lòng chờ người yêu cầu xác nhận.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_owner = getReceiverSocketId(exchangeRequest.ownerId);
            if (receiverSocketId_owner) {
                io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
            }

            const notification_requester = await Notification.create({
                receiverId: exchangeRequest.requesterId,
                content: `Chủ cuốn sách đã xác nhận hoàn tất giao dịch trao đổi cuốn sách "${bookRequested.title}". Bạn cần xác nhận để hoàn tất giao dịch và nhận điểm.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_requester = getReceiverSocketId(exchangeRequest.requesterId);
            if (receiverSocketId_requester) {
                io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
            }
        } else if (exchangeRequest.status === 'completed') {
            bookRequested.status = 'completed';
            await bookRequested.save();



            const bookOwner = await User.findById(bookRequested.ownerId);
            if (!bookOwner) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            const requester = await User.findById(exchangeRequest.requesterId);
            if (!requester) {
                return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
            }

            const notification_requester = await Notification.create({
                receiverId: exchangeRequest.requesterId,
                content: `Giao dịch trao đổi cuốn sách "${bookRequested.title}" đã hoàn tất. Đánh giá người trao đổi để nhận điểm thưởng.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_requester = getReceiverSocketId(exchangeRequest.requesterId);
            if (receiverSocketId_requester) {
                io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
            }

            const notification_owner = await Notification.create({
                receiverId: bookRequested.ownerId,
                content: `Giao dịch trao đổi cuốn sách "${bookRequested.title}" đã hoàn tất. Đánh giá người trao đổi để nhận điểm thưởng.`,
                link: `/exchange/exchange-info-detail/${requestId}`,
                image: bookRequested.images[0],
            });
            const receiverSocketId_owner = getReceiverSocketId(bookRequested.ownerId);
            if (receiverSocketId_owner) {
                io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
            }

            if (exchangeRequest.exchangeMethod === 'points') {
                bookOwner.grade += bookRequested.creditPoints;

                await bookOwner.save();
                await updatePoints(bookOwner._id, bookRequested.creditPoints, 'earn', `Nhận điểm từ yêu cầu trao đổi sách ${bookRequested.title}`);

                const notificaiton_owner = await Notification.create({
                    receiverId: bookOwner._id,
                    content: `Bạn đã nhận ${bookRequested.creditPoints} điểm từ giao dịch trao đổi sách "${bookRequested.title}".`,
                    link: `/user-profile/${bookOwner._id}`,
                    type: 'point',
                });
                const receiverSocketId_owner = getReceiverSocketId(bookOwner._id);
                if (receiverSocketId_owner) {
                    io.to(receiverSocketId_owner).emit("getNotification", notificaiton_owner);
                }
            }
            if (exchangeRequest.exchangeMethod === 'book') {
                const exchangeBook = await BookExchange.findById(exchangeRequest.exchangeBookId);
                if (!exchangeBook) {
                    return res.status(404).json({ success: false, message: 'Sách trao đổi không tồn tại' });
                } else {
                    exchangeBook.status = 'completed';
                    await exchangeBook.save();
                }


                const pointDifference = bookRequested.creditPoints - exchangeBook.creditPoints;

                if (pointDifference > 0) {
                    bookOwner.grade += pointDifference;
                    await bookOwner.save();
                    await updatePoints(bookOwner._id, pointDifference, 'earn', `Nhận điểm bù chênh lệch từ yêu cầu trao đổi sách ${bookRequested.title}`);

                    const notification_owner = await Notification.create({
                        receiverId: bookOwner._id,
                        content: `Bạn đã nhận ${pointDifference} điểm bù chênh lệch từ giao dịch trao đổi sách "${bookRequested.title}". `,
                        link: `/user-profile/${bookOwner._id}`,
                        type: 'point',
                    });
                    const receiverSocketId_owner = getReceiverSocketId(bookOwner._id);
                    if (receiverSocketId_owner) {
                        io.to(receiverSocketId_owner).emit("getNotification", notification_owner);
                    }
                } else if (pointDifference < 0) {
                    requester.grade -= pointDifference;// trừ số âm
                    await requester.save();
                    await updatePoints(requester._id, pointDifference, 'earn', `Nhận điểm bù chênh lệch từ yêu cầu trao đổi sách ${bookRequested.title}`);

                    const notification_requester = await Notification.create({
                        receiverId: requester._id,
                        content: `Bạn đã nhận ${Math.abs(pointDifference)} điểm bù chênh lệch từ giao dịch trao đổi sách "${bookRequested.title}".`,
                        link: `/user-profile/${requester._id}`,
                        type: 'point',
                    });
                    const receiverSocketId_requester = getReceiverSocketId(requester._id);
                    if (receiverSocketId_requester) {
                        io.to(receiverSocketId_requester).emit("getNotification", notification_requester);
                    }
                }

                const otherRequested_bookRequested = await ExchangeRequest.find({
                    exchangeBookId: exchangeRequest.bookRequestedId,
                    _id: { $ne: exchangeRequest._id }, // loại trừ yêu cầu hiện tại
                });

                for (const req of otherRequested_bookRequested) {
                    //xoa thong tin giao dich neu co
                    await ExchangeInfor.findOneAndDelete({ requestId: req._id });
                    await ExchangeRequest.findByIdAndDelete(req._id);
                }
                const notificationForOtherBookRequested = await Notification.create({
                    receiverId: bookRequested.ownerId,
                    content: `Bạn đã hoàn tất trao đổi cuốn sách "${bookRequested.title}". Các yêu cầu sử dụng cuốn sách này sẽ bị hủy.`,
                    link: `/post-request`,
                    image: bookRequested.images[0],
                });
                const receiverSocketIdForOtherBookRequested = getReceiverSocketId(bookRequested.ownerId);
                if (receiverSocketIdForOtherBookRequested) {
                    io.to(receiverSocketIdForOtherBookRequested).emit("getNotification", notificationForOtherBookRequested);
                }

                const otherRequested_exchangeBook = await ExchangeRequest.find({
                    exchangeBookId: exchangeRequest.exchangeBookId,
                    _id: { $ne: exchangeRequest._id }, // loại trừ yêu cầu hiện tại
                });

                for (const req of otherRequested_exchangeBook) {
                    await ExchangeInfor.findOneAndDelete({ requestId: req._id });
                    await ExchangeRequest.findByIdAndDelete(req._id);
                }

                const notificationForOtherExchangeBook = await Notification.create({
                    receiverId: exchangeBook.ownerId,
                    content: `Bạn đã hoàn tất trao đổi cuốn sách "${exchangeBook.title}". Các yêu cầu sử dụng cuốn sách này sẽ bị hủy.`,
                    link: `/post-request`,
                    image: exchangeBook.images[0],
                });
                const receiverSocketIdForOtherExchangeBook = getReceiverSocketId(exchangeBook.ownerId);
                if (receiverSocketIdForOtherExchangeBook) {
                    io.to(receiverSocketIdForOtherExchangeBook).emit("getNotification", notificationForOtherExchangeBook);
                }
            }

            //xoa các request mà 2 cuốn sách trong giao dịch được gửi 
            const otherRequests_requested = await ExchangeRequest.find({
                bookRequestedId: exchangeRequest.bookRequestedId,
                _id: { $ne: exchangeRequest._id }, // loại trừ yêu cầu hiện tại
            });
            let otherRequests_exchangeBook = null;
            if (exchangeRequest.exchangeMethod === 'book') {
                otherRequests_exchangeBook = await ExchangeRequest.find({
                    bookRequestedId: exchangeRequest.exchangeBookId,
                    _id: { $ne: exchangeRequest._id }, // loại trừ yêu cầu hiện tại
                });
            }
            const otherRequests = [...otherRequests_requested, ...otherRequests_exchangeBook];
            for (const req of otherRequests) {
                // Tạo thông báo cho requester của các yêu cầu bị xoá
                const notification = await Notification.create({
                    receiverId: req.requesterId,
                    content: `Cuốn sách bạn gửi yêu cầu trao đổi "${bookRequested.title}" đã được trao đổi. Yêu cầu của bạn đã bị hủy.`,
                    link: `/post-request`,
                    image: bookRequested.images[0],
                });

                const socketId = getReceiverSocketId(req.requesterId);
                if (socketId) {
                    io.to(socketId).emit("getNotification", notification);
                }
                //xoa thong tin giao dich neu co
                await ExchangeInfor.findOneAndDelete({ requestId: req._id });

                await ExchangeRequest.findByIdAndDelete(req._id);
            }

            //xóa các yêu cầu mà 2 cuốn sách này là exchangeBook
            if (exchangeRequest.exchangeMethod === 'book') {
                
            }
        }
        res.status(200).json({ success: true, message: 'Đã xác nhận hoàn thành trao đổi.' });
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
