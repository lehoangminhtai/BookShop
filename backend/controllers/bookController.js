const { default: mongoose } = require('mongoose');
const cloudinary = require("../utils/cloudinary");
const Book = require('../models/bookModel');

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
        res.status(201).json({
            success: true,
            book
        })

    } catch (error) {
        console.log(error);
        next(error);

    }
}

const getBooks = async (req,res) =>{
    const books = await Book.find({}).sort({createAt:-1}).populate('categoryId','nameCategory');

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
const updateBook = async(req, res) => {
    const {id} = req.params;

    // Kiểm tra id có hợp lệ không
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such book'});
    }

    // Xử lý việc upload file
    let images = req.body.images; // giữ nguyên ảnh cũ nếu không có ảnh mới
    if (req.file) {
        images = `/uploads/${req.file.filename}`; // cập nhật ảnh mới
    }

    try {
        const book = await Book.findOneAndUpdate({_id: id}, {
            ...req.body,
            images // Cập nhật trường images trong MongoDB
        }, {new: true}); // {new: true} trả về bản ghi đã cập nhật

        if (!book) {
            return res.status(404).json({error: 'No such book'});
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
   createBook,
    getBook,
    getBooks,
    deleteBook,
    updateBook    
}