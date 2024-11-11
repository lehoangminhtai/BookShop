const Discount = require('../models/discountModel');

// Tạo mã giảm giá mới
exports.createDiscount = async (req, res) => {
    try {
        const { discountCode, discountName, discountDescription, percent, minOfTotalPrice, dateStart, dateExpire } = req.body;

        const newDiscount = new Discount({
            discountCode,
            discountName,
            discountDescription,
            percent,
            minOfTotalPrice,
            dateStart,
            dateExpire
        });

        await newDiscount.save();
        res.status(201).json({ success: true, data: newDiscount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy tất cả mã giảm giá
exports.getAllDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find();
        res.status(200).json({ success: true, data: discounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy mã giảm giá theo ID
exports.getDiscountById = async (req, res) => {
    try {
        const discountId = req.params.id;
        const discount = await Discount.findById(discountId);

        if (!discount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }

        res.status(200).json({ success: true, data: discount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật mã giảm giá
exports.updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const { discountCode, discountName, discountDescription, percent, minOfTotalPrice, dateStart, dateExpire } = req.body;

        const updatedDiscount = await Discount.findByIdAndUpdate(
            discountId,
            {
                discountCode,
                discountName,
                discountDescription,
                percent,
                minOfTotalPrice,
                dateStart,
                dateExpire
            },
            { new: true }
        );

        if (!updatedDiscount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }

        res.status(200).json({ success: true, data: updatedDiscount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa mã giảm giá
exports.deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.id;
        const deletedDiscount = await Discount.findByIdAndDelete(discountId);

        if (!deletedDiscount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }

        res.status(200).json({ success: true, message: "Discount deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
