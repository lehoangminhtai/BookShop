const mongoose = require('mongoose');
const BookSale = require('../models/bookSaleModel');

// Tạo mới một sách để bán
const createBookSale = async (req, res, next) => {
    const { bookSales } = req.body; // Lấy dữ liệu từ body request

    try {
        // Thực hiện upsert (cập nhật hoặc tạo mới nếu không có)
        const createdBookSales = await Promise.all(bookSales.map(async (bookSale) => {
            const { bookId, quantity, price, discount } = bookSale;
            const updatedBookSale = await BookSale.findOneAndUpdate(
                { bookId }, // Tìm theo bookId
                { $set: { quantity, price, discount, status: 'available' } }, // Cập nhật thông tin
                { new: true, upsert: true } // Trả về bản ghi mới và tạo mới nếu không tìm thấy
            );
            return updatedBookSale;
        }));

        res.status(201).json({
            success: true,
            message: 'Books Sale Added or Updated Successfully!',
            data: createdBookSales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to add or update books sale',
            error: error.message
        });
    }
};

// Lấy tất cả sách để bán
const getBookSales = async (req, res) => {
    try {
        const bookSales = await BookSale.find({})
            .sort({ createdAt: -1 })
            .populate('bookId', 'title author images'); // Liên kết với thông tin cơ bản của sách

        res.status(200).json(bookSales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin chi tiết của một sách để bán theo ID
const getBookSale = async (req, res) => {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const bookSale = await BookSale.findOne({ bookId }).populate('bookId', 'title author');
        if (!bookSale) {
            return res.status(404).json({ error: 'No such book sale record' });
        }

        res.status(200).json(bookSale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Xóa một sách để bán theo ID
const deleteBookSale = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such book sale record' });
    }

    try {
        const bookSale = await BookSale.findByIdAndDelete(id);
        
        if (!bookSale) {
            return res.status(404).json({ error: 'No such book sale record' });
        }

        res.status(200).json({ success: true, message: 'Book sale deleted successfully', bookSale });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật thông tin sách để bán
const updateBookSale = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such book sale record' });
    }

    try {
        const bookSale = await BookSale.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!bookSale) {
            return res.status(404).json({ error: 'No such book sale record' });
        }

        res.status(200).json({ success: true, bookSale });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createBookSale,
    getBookSales,
    getBookSale,
    deleteBookSale,
    updateBookSale
};
