const Order = require('../models/orderModel');
const Discount = require('../models/discountModel');
const Payment = require('../models/paymentModel');
const discountController = require('../controllers/discountController')
const moment = require('moment');
// Tạo đơn hàng mới

exports.createOrder = async (req, res) => {
    try {
        const { userId, address, itemsPayment, discountCode, shippingFee, totalPrice,paymentMethod} = req.body;

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
        console.log(error)
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
        const orders = await Order.find({ userId }).sort({createdAt:-1}).populate('itemsPayment.bookId');

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const {orderId} = req.params;
        const { orderStatus, deliveryAt } = req.body;
        
        // Nếu trạng thái đơn hàng là 'completed' thì thêm thời gian giao hàng
        const updateData = { orderStatus, deliveryAt };
        if (orderStatus === 'completed') {
            updateData.deliveryAt =  Date.now();
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
