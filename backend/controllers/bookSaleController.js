const mongoose = require('mongoose');
const BookSale = require('../models/bookSaleModel');
const Book  = require("../models/bookModel")


// Tạo mới một sách để bán
const createBookSale = async (req, res) => {
    try {
        
        const bookSale = new BookSale(req.body);
        await bookSale.save();

       return{
            success: true,
            message: 'BookSale created successfully',
            bookSale
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Lấy tất cả sách để bán
const getBookSales = async (req, res) => {
    try {
        const bookSales = await BookSale.find({status: { $ne: 'hide' }})
            .sort({ createdAt: -1 })
            .populate('bookId', 'title author images'); // Liên kết với thông tin cơ bản của sách

        res.status(200).json(bookSales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getBookSalesNotAvailable = async (req, res) => {
    try {
        const bookSales = await BookSale.find({status: 'hide'})
            .sort({ createdAt: -1 })
            .populate('bookId', 'title author images'); // Liên kết với thông tin cơ bản của sách

        res.status(200).json(bookSales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookSalesAdmin = async (req, res) => {
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

const searchBookSalesByTitle = async (req, res) => {
    const { title } = req.query; // Nhận tên sách từ query params
    try {
        // Tìm các sách có title khớp với từ khóa tìm kiếm
        const books = await Book.find({
            title: { $regex: title, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa/thường
        });

        if (!books.length) {
            return res.status(200).json({ success: true, bookSales: [] });
        }

        // Lấy danh sách bookId từ kết quả tìm kiếm
        const bookIds = books.map(book => book._id);

        // Tìm các bản ghi BookSale dựa trên danh sách bookId
        const bookSales = await BookSale.find({ bookId: { $in: bookIds } })
            .sort({ createdAt: -1 })
            .populate('bookId', 'title author images'); // Đưa thông tin cơ bản của sách vào kết quả

        res.status(200).json({success: true, bookSales: bookSales});
    } catch (error) {
        res.status(500).json({success:false, error: error.message });
    }
};



module.exports = {
    createBookSale,
    getBookSales,
    getBookSale,
    deleteBookSale,
    updateBookSale,
    getBookSalesAdmin,
    getBookSalesNotAvailable,
    searchBookSalesByTitle
};
