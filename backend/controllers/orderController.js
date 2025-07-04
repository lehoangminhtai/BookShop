const Order = require('../models/orderModel');
const Discount = require('../models/discountModel');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Notification = require("../models/notificationModel");
const discountController = require('../controllers/discountController')
const moment = require('moment');
const { logAction } = require('../middleware/logMiddleware.js');
const { io, getReceiverSocketId } = require("../utils/socket.js");
// Tạo đơn hàng mới

exports.createOrder = async (req, res) => {
    try {
        const { userId, address, itemsPayment, discountCode, shippingFee, totalPrice, paymentMethod } = req.body;
        const idUser = req.userId
        let discountAmount = 0;
        let discountId = null;

        if (discountCode) {

            const discountResponse = await discountController.applyDiscount({
                body: { discountCode, userId, totalPrice }
            });

            if (discountResponse.success) {
                discountAmount = discountResponse.discountAmount;

                discountId = discountResponse.discountCode;
            }


        }

        const finalAmount = totalPrice - discountAmount + shippingFee;

        const newOrder = new Order({
            userId,
            address,
            itemsPayment,
            discountId,
            shippingFee,
            totalPrice,
            finalAmount
        });

        const response = await newOrder.save();
        if (response) {

            const payment = new Payment({
                transactionId: `${paymentMethod}_${moment().format('YYMMDD')}_${response._id}`,
                orderId: response._id,
                userId: userId,
                paymentMethod: paymentMethod,
                finalAmount: finalAmount,
            });
            if (await payment.save()) {
                await logAction(
                    'Mua hàng',
                    idUser,
                    `Người dùng ${idUser} đặt hàng: ${newOrder.finalAmount} vnđ`,
                    { newOrder, payment }
                );
            }
            res.status(201).json({ success: true, data: newOrder, payment });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('userId')

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy tất cả đơn hàng của người dùng
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

function formatDate(date) {
    const d = new Date(date);
    const day = (`0${d.getDate()}`).slice(-2);
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Cập nhật trạng thái đơn hàng (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, deliveryAt } = req.body;
        const idUser = req.userId

        const user = await User.findById(idUser);

        if (user.role !== 1) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập vào chức năng này" });
        }

        // Nếu trạng thái đơn hàng là 'completed' thì thêm thời gian giao hàng
        const updateData = { orderStatus, deliveryAt };
        if (orderStatus === 'shipped') {
            updateData.deliveryAt = Date.now();
        }
        if (orderStatus === 'completed') {
            updateData.deliveryAt = Date.now();
        }
        else if (deliveryAt) {

            updateData.deliveryAt = new Date(deliveryAt);
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const book = await Book.findById(updatedOrder.itemsPayment[0].bookId);

        if (updatedOrder.orderStatus === 'confirm') {

            // Gửi thông báo đến người dùng
            const notification = await Notification.create({
                receiverId: updatedOrder.userId,
                content: `Đơn hàng ${updatedOrder._id} đã được xác nhận.`,
                link: `/account/orders#`,
                image: book.images[0],
            });

            const receiverSocketId = getReceiverSocketId(updatedOrder.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
        } else if (updatedOrder.orderStatus === 'shipping') {

            const deliveryDate = formatDate(updatedOrder.deliveryAt);

            const notification = await Notification.create({
                receiverId: updatedOrder.userId,
                content: `Đơn hàng ${updatedOrder._id} đang được giao. Ngày giao hàng dự kiến: ${deliveryDate}. Vui lòng chú ý theo dõi!`,
                link: `/account/orders#`,
                image: book.images[0],
            });

            const receiverSocketId = getReceiverSocketId(updatedOrder.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
        } else if (updatedOrder.orderStatus === 'shipped') {
            const notification = await Notification.create({
                receiverId: updatedOrder.userId,
                content: `Đơn hàng ${updatedOrder._id} đã được giao. Vui lòng xác nhận hoàn thành để nhận điểm thưởng nhé.`,
                link: `/account/orders#`,
                image: book.images[0],
            });

            const receiverSocketId = getReceiverSocketId(updatedOrder.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
        }
        else if (updatedOrder.orderStatus === 'completed') {
            const gradePlus = (updatedOrder.finalAmount / 1000) * 0.1
            user.grade += gradePlus;
            await user.save();
            
            const notification = await Notification.create({
                receiverId: updatedOrder.userId,
                content: `Đơn hàng ${updatedOrder._id} đã hoàn tất. Bạn hãy đánh giá sản phẩm để nhận điểm thưởng nhé.`,
                link: `/account/orders#`,
                image: book.images[0],
            });

            const receiverSocketId = getReceiverSocketId(updatedOrder.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
        }
        else if (updatedOrder.orderStatus === 'failed') {
            const notification = await Notification.create({
                receiverId: updatedOrder.userId,
                content: `Đơn hàng ${updatedOrder._id} đã bị hủy. Vui lòng kiểm tra lại thông tin đơn hàng.`,
                link: `/account/orders#`,
                image: book.images[0],
            });

            const receiverSocketId = getReceiverSocketId(updatedOrder.userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
        }

        await logAction(
            'Cập nhật trạng thái đơn hàng',
            idUser,
            `Quản trị ${idUser} cập nhật trạng thái đơn hàng: ${orderId + " " + updateData.orderStatus} `,
            { updatedOrder }
        );
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật phương thức thanh toán (nếu cần)
exports.updatePaymentMethod = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { paymentMethod } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { paymentMethod },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái thanh toán khi đã thanh toán
exports.updatePaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderStatus, paidAt } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus, paidAt },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.userUpdateOrder = async (req, res) => {
    try {
        const { userId, orderId, orderStatus } = req.body;

        if (orderStatus === 'cancel') {
            const updateOrder = await Order.findById(orderId);
            updateOrder.orderStatus = 'failed';
            await updateOrder.save();

            const notification = await Notification.create({
                receiverId: userId,
                content: `Đơn hàng ${orderId} đã được hủy.`,
                link: `/`,
                image: null,
            });

            const receiverSocketId = getReceiverSocketId(userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
            await logAction(
                'Huỷ đơn hàng',
                userId,
                `Người dùng ${userId} hủy đơn hàng: ${orderId} `,
                { updateOrder }
            );
            return res.status(200).json({ success: true, data: updateOrder });

        }

        if (orderStatus === 'completed') {
            const updateOrder = await Order.findById(orderId);
            updateOrder.orderStatus = 'completed';
            await updateOrder.save();

            const gradePlus = (updateOrder.finalAmount / 1000) * 0.1
            const user = await User.findById(userId);
            user.grade += gradePlus;
            await user.save();
            
            const notification = await Notification.create({
                receiverId: userId,
                content: `Đơn hàng ${orderId} đã thành công vui lòng đánh giá để nhận điểm thưởng.`,
                link: `/account/orders#`,
                image: null,
            });

            const receiverSocketId = getReceiverSocketId(userId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("getNotification", notification);
            }
             await logAction(
                'Xác nhận đơn hàng',
                userId,
                `Người dùng ${userId} xác nhận đơn: ${orderId} `,
                { updateOrder }
            );
            return res.status(200).json({ success: true, data: updateOrder });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateUrlCheckoutOrder = async (req, res) => {
    try {
        const { orderId, url } = req.body;

        const updateOrder = await Order.findById(orderId);
        updateOrder.url_checkout = url;
        await updateOrder.save();

        return res.status(200).json({ success: true, data: updateOrder });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateStatusOrderWithoutPayment = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;

        const updateOrder = await Order.findById(orderId);
        updateOrder.orderStatus = orderStatus;
        await updateOrder.save();

        return res.status(200).json({ success: true, data: updateOrder });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};


