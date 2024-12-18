const mongoose = require('mongoose');
const BookSale = require('../models/bookSaleModel');
const Book = require("../models/bookModel")
const Order = require("../models/orderModel")
const { logAction } = require('../middleware/logMiddleware.js');

// Tạo mới một sách để bán
const createBookSale = async (req, res) => {
    try {

        const bookSale = new BookSale(req.body);
        await bookSale.save();

        return {
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
        // Lấy các tham số page và limit từ query string, mặc định là page = 1, limit = 10
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const limit = parseInt(req.query.limit) || 8; // Số lượng sách mỗi trang
        const skip = (page - 1) * limit; // Số tài liệu cần bỏ qua

        // Tìm bookSales không có status "hide" và phân trang
        const bookSales = await BookSale.find({ status: { $ne: 'hide' } })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian giảm dần
            .skip(skip) // Bỏ qua các tài liệu của các trang trước
            .limit(limit) // Lấy số tài liệu giới hạn mỗi trang
            .populate('bookId', 'title author images'); // Liên kết với thông tin cơ bản của sách

        // Tính tổng số lượng bookSales
        const totalBookSales = await BookSale.countDocuments({ status: { $ne: 'hide' } });

        // Trả về kết quả bao gồm dữ liệu và thông tin phân trang
        res.status(200).json({
            success: true,
            data: bookSales,
            currentPage: page,
            totalPages: Math.ceil(totalBookSales / limit),
            totalBookSales: totalBookSales,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách bookSales', error: error.message });
    }
};




const getBookSalesNotAvailable = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const bookSales = await BookSale.find({ status: 'hide' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('bookId', 'title author images');

        const totalBookSales = await BookSale.countDocuments({ status: 'hide' });

        res.status(200).json({
            success: true,
            data: bookSales,
            currentPage: page,
            totalPages: Math.ceil(totalBookSales / limit),
            totalBookSales: totalBookSales, // Thêm totalItems cho đồng nhất
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBookSalesAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const bookSales = await BookSale.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('bookId', 'title author images');

        const totalBookSales = await BookSale.countDocuments({});

        res.status(200).json({
            success: true,
            data: bookSales,
            currentPage: page,
            totalPages: Math.ceil(totalBookSales / limit),
            totalBookSales: totalBookSales, // Thêm totalItems cho đồng nhất
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    const userId = req.userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such book sale record' });
    }

    try {
        const bookSale = await BookSale.findByIdAndUpdate(id, req.body, { new: true }).populate('bookId', 'title author');

        if (!bookSale) {
            return res.status(404).json({ error: 'No such book sale record' });
        }
        await logAction(
            'Cập nhật sách',
            userId,
            `Quản trị viên ${userId} đã cập nhật sách bán: ${bookSale.bookId.title}`,
            bookSale
        );
        res.status(200).json({ success: true, bookSale });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchBookSalesByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        // Tìm các sách có title khớp với từ khóa tìm kiếm
        const books = await Book.find({
            title: { $regex: title, $options: 'i' }
        }).select('_id'); // Chỉ lấy _id để tối ưu performance

        if (!books.length) {
            return res.status(200).json({
                success: true,
                data: [],
                currentPage: page,
                totalPages: 0,
                totalBookSales: 0
            });
        }

        const bookIds = books.map(book => book._id);

        // Tìm các bản ghi BookSale dựa trên danh sách bookId VÀ thực hiện phân trang
        const bookSales = await BookSale.find({ bookId: { $in: bookIds } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('bookId', 'title author images');

            //Đếm tổng số kết quả tìm thấy
            const totalBookSales = await BookSale.countDocuments({ bookId: { $in: bookIds } });

        res.status(200).json({
            success: true,
            data: bookSales,
            currentPage: page,
            totalPages: Math.ceil(totalBookSales / limit),
            totalBookSales: totalBookSales
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const searchBookSales = async (req, res) => {
    const { query, page } = req.query; // Chỉ nhận query, page, và limit
    const limit = 8;
    try {
        // Tìm các sách có title hoặc author khớp với từ khóa tìm kiếm
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Tìm kiếm theo title không phân biệt hoa/thường
                { author: { $regex: query, $options: 'i' } } // Tìm kiếm theo author không phân biệt hoa/thường
            ]
        });

        if (!books.length) {
            return res.status(200).json({ success: true, bookSales: [], totalPages: 0 });
        }

        // Lấy danh sách bookId từ kết quả tìm kiếm
        const bookIds = books.map(book => book._id);

        // Phân trang
        const skip = (page - 1) * limit;

        // Tìm các bản ghi BookSale dựa trên danh sách bookId
        const bookSales = await BookSale.find({ bookId: { $in: bookIds }, status: { $ne: 'hide' } })
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
            .skip(skip) // Bỏ qua các bản ghi không nằm trong trang hiện tại
            .limit(Number(limit)) // Giới hạn số bản ghi trả về
            .populate('bookId', 'title author images'); // Đưa thông tin cơ bản của sách vào kết quả

        // Tính tổng số lượng bản ghi để xác định số trang
        const totalBookSales = await BookSale.countDocuments({ bookId: { $in: bookIds }, status: { $ne: 'hide' } });
        const totalPages = Math.ceil(totalBookSales / limit);

        res.status(200).json({
            success: true,
            bookSales,
            totalPages,
            totalBookSales,
            currentPage: Number(page),
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getBookSalesByCategory = async (req, res) => {
    
    const { page,categoryId  } = req.query; 
    const limit = 8 //số item
    try {
        // Tìm các sách thuộc categoryId
        const books = await Book.find({ categoryId: categoryId });

        if (!books.length) {
            return res.status(200).json({ success: true, bookSales: [], message: 'No books found for this category' });
        }

        // Lấy danh sách bookIds từ các sách tìm được
        const bookIds = books.map(book => book._id);

        // Tính toán phân trang
        const skip = (page - 1) * limit;
        const totalBookSales = await BookSale.countDocuments({ bookId: { $in: bookIds } }); // Đếm tổng số bookSale
        const totalPages = Math.ceil(totalBookSales / limit);

        // Tìm các bản ghi BookSale theo danh sách bookIds và phân trang
        const bookSales = await BookSale.find({ bookId: { $in: bookIds } })
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
            .populate('bookId', 'title author images') // Lấy thông tin title, author, images của sách
            .skip(skip) // Áp dụng skip
            .limit(Number(limit)); // Áp dụng limit

        res.status(200).json({
            success: true,
            bookSales: bookSales,
            totalBookSales: totalBookSales,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        // Xử lý lỗi
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getTopBooks = async (req, res) => {
    try {
        // Lấy các tham số từ query string, nếu không có thì mặc định là trang 1 và giới hạn 10 cuốn
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const currentYear = new Date().getFullYear();
        const startOfMonth = `${currentYear}-01-01`; // Ngày bắt đầu của năm
        const endOfMonth = `${currentYear}-12-31`; // Ngày kết thúc của năm

        // Chuyển đổi chuỗi ngày sang đối tượng Date
        const startMonth = new Date(startOfMonth);
        const endMonth = new Date(endOfMonth);

        // Kiểm tra xem ngày bắt đầu có nhỏ hơn ngày kết thúc hay không
        if (startMonth > endMonth) {
            return res.status(400).json({ message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc." });
        }

        // Đảm bảo thời gian của startDate là đầu ngày và endDate là cuối ngày
        startMonth.setHours(0, 0, 0, 0);
        endMonth.setHours(23, 59, 59, 999);

        // Lấy 50 cuốn sách bán chạy nhất
        const topBooks = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startMonth, $lte: endMonth },
                    orderStatus: 'completed'
                }
            },
            {
                $unwind: "$itemsPayment" // Tách các phần tử trong mảng `itemsPayment`
            },
            {
                $group: {
                    _id: "$itemsPayment.bookId", // Gom nhóm theo `bookId`
                    totalSold: { $sum: "$itemsPayment.quantity" } // Tính tổng `quantity`
                }
            },
            {
                $sort: { totalSold: -1 } // Sắp xếp giảm dần theo tổng số lượng bán
            },
            {
                $limit: 50 // Lấy tổng 50 sách bán chạy nhất
            },
            {
                $lookup: { // Liên kết với model Book để lấy thông tin sách
                    from: 'books', // Tên collection `books`
                    localField: '_id', // `_id` là `bookId`
                    foreignField: '_id', // `_id` trong model Book
                    as: 'bookDetails' // Tên trường chứa thông tin sách
                }
            },
            {
                $project: {
                    _id: 1, // Ẩn `_id`
                    title: { $arrayElemAt: ["$bookDetails.title", 0] },
                    author: { $arrayElemAt: ["$bookDetails.author", 0] },
                    images: { $arrayElemAt: ["$bookDetails.images", 0] }
                }
            }
        ]);

        // Nếu trả về ít hơn 50 cuốn sách, giảm dần số lượng sách còn lại
        const result = topBooks.slice((page - 1) * limit, page * limit);
        const totalPages = Math.ceil(topBooks.length / limit);

        // Trả về kết quả phân trang
        res.status(200).json({
            success: true,
            page,
            limit,
            totalBooks: topBooks.length,
            totalPages,
            books: result
        });
    } catch (error) {
        console.error('Lỗi khi lấy top 50 sách bán chạy nhất:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const getLastBooks = async (req, res) => {
    try {
        // Lấy các tham số từ query string
        const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
        const limit = parseInt(req.query.limit) || 10; // Số sách mỗi trang (mặc định là 10)

        // Tính toán số tài liệu cần bỏ qua
        const skip = (page - 1) * limit;

        // Truy vấn sách mới nhất, phân trang
        const books = await BookSale.find({ status: { $ne: 'hide' } })
        .populate('bookId', 'title author images')
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo giảm dần
            .skip(skip) // Bỏ qua số tài liệu của các trang trước
            .limit(limit); // Giới hạn số tài liệu mỗi trang

        // Tính tổng số sách để trả về thông tin tổng số trang
        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            success: true,
            books: books,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sách',
            error: error.message,
        });
    }
};



module.exports = {
    createBookSale,
    getBookSales,
    getBookSale,
    getTopBooks,
    getLastBooks,
    deleteBookSale,
    updateBookSale,
    getBookSalesAdmin,
    getBookSalesNotAvailable,
    searchBookSalesByTitle,
    searchBookSales,
    getBookSalesByCategory
};
