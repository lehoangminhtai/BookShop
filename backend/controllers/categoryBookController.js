const CategoryBook = require('../models/categoryBookModel');
const cloudinary = require("../utils/cloudinary");
const Book = require('../models/bookModel');

const createCategoryBook = async (req,res) =>{
    const {nameCategory, image} = req.body;

    try{
        if(!nameCategory){
            return res.status(400).json({success:false, message: "Vui lòng nhập tên thể loại"});
        }
        if(!image){
            return res.status(400).json({success:false, message: "Vui lòng chọn ảnh cho sách"});
        }

        const result = await cloudinary.uploader.upload(image, {
            folder: "uploadCategory"
        })
        const categoryBook = await CategoryBook.create({nameCategory, image: result.secure_url});
        res.status(200).json({success:true, categoryBook});
    }
    catch (error){
        res.status(400).json({error:error.message});
    }
}



const getCategoryBooks = async (req,res) =>{
    const categoryBooks = await CategoryBook.find({}).sort({createAt: -1});
    
    res.status(200).json(categoryBooks);
}

const getCategoryWithBookCount = async (req, res) => {
    try {
        // Lấy tất cả các danh mục
        const categories = await CategoryBook.find();

        // Đếm số sách cho mỗi danh mục
        const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
            const bookCount = await Book.countDocuments({ categoryId: category._id });
            return {
                _id: category._id,
                nameCategory: category.nameCategory,
                image: category?.image,
                bookCount
            };
        }));

        res.status(200).json(categoriesWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategoryBook = async (req, res) => {
    const { categoryId } = req.params;  // Lấy categoryId từ params (URL)
    const { nameCategory, image } = req.body;  // Lấy thông tin cần cập nhật từ body

    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "uploadCategory"
        })
        // Tìm thể loại sách theo ID và cập nhật thông tin
        const updatedCategoryBook = await CategoryBook.findByIdAndUpdate(
            categoryId,
            { nameCategory, image: result.secure_url }, // Trường cần cập nhật
            { new: true } // Trả về đối tượng đã được cập nhật
        );

        // Nếu không tìm thấy thể loại sách, trả về lỗi 404
        if (!updatedCategoryBook) {
            return res.status(404).json({success:false, message: 'Thể loại sách không tồn tại.' });
        }

        // Trả về đối tượng đã cập nhật
        return res.status(200).json({success:true,
            message: 'Cập nhật thể loại sách thành công.',
            data: updatedCategoryBook
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false, message: 'Lỗi khi cập nhật thể loại sách.', error });
    }
};

const deleteCategoryBook = async (req,res) =>{
    const {categoryId} = req.params

    try {
        const category = await CategoryBook.findByIdAndDelete(categoryId)
        if(category){
            return res.status(200).json({success: true, message:"Xóa thể loại sách thành công"})
        }
        else{
            return res.status(400).json({success: false, message: "Xóa thể loại sách thất bại"})
        }
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports = {
    createCategoryBook,
    getCategoryBooks,
    getCategoryWithBookCount,
    updateCategoryBook,
    deleteCategoryBook
}