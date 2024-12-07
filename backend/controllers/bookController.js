const { default: mongoose } = require('mongoose');
const cloudinary = require("../utils/cloudinary");
const Book = require('../models/bookModel');
const BookSaleController = require('../controllers/bookSaleController')

const createBook = async (req,res, next) =>{
    const { title, author, description,images, publisher, categoryId } = req.body;

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

const getBooks = async (req,res) =>{
    const books = await Book.find({}).sort({createdAt:-1}).populate('categoryId','nameCategory');
    res.status(200).json(books);
}

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
        await book.save();

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


module.exports = {
   createBook,
    getBook,
    getBooks,
    deleteBook,
    updateBook    
}