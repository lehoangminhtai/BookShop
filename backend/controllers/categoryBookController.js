const CategoryBook = require('../models/categoryBookModel');
const Book = require('../models/bookModel');

const createCategoryBook = async (req,res) =>{
    const {nameCategory} = req.body;

    try{
        const categoryBook = await CategoryBook.create({nameCategory});
        res.status(200).json(categoryBook);
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
                bookCount
            };
        }));

        res.status(200).json(categoriesWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategoryBook,
    getCategoryBooks,
    getCategoryWithBookCount
}