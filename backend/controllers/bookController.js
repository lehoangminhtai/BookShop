const { default: mongoose } = require('mongoose');
const cloudinary = require("../utils/cloudinary");
const Book = require('../models/bookModel');
const BookSaleController = require('../controllers/bookSaleController')
const { logAction } = require('../middleware/logMiddleware.js');

const createBook = async (req,res, next) =>{
    const { title, author, description,images, publisher, categoryId } = req.body;
   
    const userId = req.userId
    try {
        const result = await cloudinary.uploader.upload(images, {
            folder: "uploads",
            // width: 300,
            // crop: "scale"
        })
        const book = await Book.create({
            title,
            author,
            description,
            images: result.secure_url,
            publisher,
            categoryId
        });
        if(book){
            const responseBookSale = await BookSaleController.createBookSale(
                {
                    body: {bookId: book._id, quantity: 0, price: 0, discount: 0}
                }
            )
            
            if (responseBookSale.success) {
                await logAction(
                    'Thêm sách',
                    userId,
                    `Quản trị viên ${userId} đã thêm sách mới với tiêu đề: ${title}`
                  );
            } else  if (!responseBookSale.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Lỗi tạo sách bán' 
                });
            }
        }
        else{
            return res.status(400).json({
                success: false,
                message: 'Tạo sách thất bại'
            })
        }
        res.status(201).json({
            success: true,
            message: 'Đã ghi mới thông tin sách và tạo sách bán',
            book
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Tạo sách thất bại' + error
        })

    }
}

const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Trang hiện tại
        const limit = parseInt(req.query.limit) || 30; // Số lượng sách mỗi trang
        const skip = (page - 1) * limit;
        // Tìm sách và phân trang
        const books = await Book.find({})
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian giảm dần
            .skip(skip) // Bỏ qua các tài liệu của các trang trước
            .limit(limit) // Lấy số tài liệu giới hạn mỗi trang
            .populate('categoryId', 'nameCategory'); // Liên kết với thông tin thể loại
        // Tính tổng số lượng sách
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.max(Math.ceil(totalBooks / limit), 1);
        // Trả về dữ liệu cùng thông tin phân trang
        res.status(200).json({
            success: true,
            data: books,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalBooks, // Đổi tên thành totalItems
        });
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách sách', error: error.message });
    }
};

const getBook = async (req,res) =>{
    const{id} =req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return(res.status(404).json({error: 'No such book'}));
    }
    const book = await Book.findById(id).populate('categoryId','nameCategory');

    if(!book){
        return res.status(404).json({error: 'No such book'});

    }
    res.status(200).json(book);
}

const deleteBook = async(req, res) =>{
    const{id} =req.params; 
    if(!mongoose.Types.ObjectId.isValid(id)){
        return(res.status(404).json({error: 'No such book'}));
    }

    const book = await Book.findOneAndDelete({_id:id});
    if(!book){
        return res.status(404).json({error: 'No such book'});

    }

    res.status(200).json(book);
}
const updateBook = async (req, res) => {
    const { bookId } = req.params; // Lấy ID của sách cần cập nhật
    const { title, author, description, images, publisher, categoryId } = req.body;

    const userId = req.userId
    
    try {
        // Tìm sách theo bookId
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Sách không tồn tại'
            });
        }

        // Kiểm tra xem có hình ảnh mới không, nếu có thì upload lên Cloudinary
        let imageUrls = book.images; // Nếu không có hình ảnh mới, giữ nguyên danh sách ảnh cũ

        if (images) {
            if (Array.isArray(images)) {
                // Nếu images là một mảng, ta upload từng ảnh lên Cloudinary
                const uploadPromises = images.map(image => 
                    cloudinary.uploader.upload(image, { folder: 'uploads' })
                );
                const uploadResults = await Promise.all(uploadPromises);
                imageUrls = uploadResults.map(result => result.secure_url); // Lấy các URL của ảnh đã upload
            } else {
                // Nếu images chỉ là một ảnh đơn, ta upload nó lên Cloudinary
                const result = await cloudinary.uploader.upload(images, { folder: 'uploads' });
                imageUrls = [result.secure_url]; // Chỉ có một ảnh
            }
        }

        // Cập nhật thông tin sách
        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.images = imageUrls; // Cập nhật danh sách ảnh mới (nếu có)
        book.publisher = publisher || book.publisher;
        book.categoryId = categoryId || book.categoryId;

        // Lưu sách đã cập nhật
        if(await book.save())
        {
            await logAction(
                'Cập nhật sách',
                userId,
                `Quản trị viên ${userId} đã cập nhật sách: ${book.title}`,
                book
              );
        }


        // Trả về thông báo thành công cùng thông tin sách đã cập nhật
        res.status(200).json({
            success: true,
            message: 'Cập nhật sách thành công',
            book
        });

    } catch (error) {
        // Xử lý lỗi
        return res.status(400).json({
            success: false,
            message: 'Cập nhật sách thất bại: ' + error.message
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query; // Lấy query từ query parameters

        // Xây dựng điều kiện tìm kiếm
        const searchCondition = query
            ? {
                  $or: [
                      { title: { $regex: query, $options: 'i' } }, // Tìm kiếm trong title
                      { author: { $regex: query, $options: 'i' } }, // Tìm kiếm trong author
                  ],
              }
            : {};

        // Phân trang
        const skip = (page - 1) * limit;
        const books = await Book.find(searchCondition)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }); // Sắp xếp sách mới nhất lên trước

        // Đếm tổng số sách
        const totalBooks = await Book.countDocuments(searchCondition);

        res.status(200).json({
            success: true,
            data: books,
            pagination: {
                totalBooks,
                currentPage: Number(page),
                totalPages: Math.ceil(totalBooks / limit),
                pageSize: Number(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
   createBook,
    getBook,
    getBooks,
    deleteBook,
    updateBook,
    searchBooks    
}