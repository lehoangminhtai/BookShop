const Order = require('../models/orderModel');
const Discount = require('../models/discountModel');
const Payment = require('../models/paymentModel');
const moment = require('moment');
// Tạo đơn hàng mới

exports.createOrder = async (req, res) => {
    try {
        const { userId, address, itemsPayment, discountCode, shippingFee, totalPrice,paymentMethod} = req.body;

        let discountAmount = 0;
        let discountId = null;

        if (discountCode) {
            
            const discount = await Discount.findOne({
                discountCode: discountCode,
                dateStart: { $lte: new Date() }, // Kiểm tra nếu discountCode đã bắt đầu
                dateExpire: { $gte: new Date() } // Kiểm tra nếu discountCode chưa hết hạn
            });
            
            if (discount) {
                if(totalPrice>=discount.minOfTotalPrice){
                discountId = discount._id;
                discountAmount = (totalPrice * discount.percent) / 100; // Tính giá trị giảm giá
                }
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
        if(response)
        {

            const payment = new Payment({
                transactionId: `${paymentMethod}_${moment().format('YYMMDD')}_${response._id}`,
                orderId: response._id,
                userId: userId,
                paymentMethod: paymentMethod,
                finalAmount: finalAmount,
            });
            await payment.save();
            res.status(201).json({ success: true, data: newOrder, payment });
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate('userId').populate('itemsPayment.bookId');

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
        const orders = await Order.find({ userId }).populate('itemsPayment.bookId');

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { orderStatus, deliveryAt } = req.body;

        // Nếu trạng thái đơn hàng là 'completed' thì thêm thời gian giao hàng
        const updateData = { orderStatus };
        if (orderStatus === 'completed') {
            updateData.deliveryAt = deliveryAt || Date.now();
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
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
