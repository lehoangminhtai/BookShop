const CategoryBook = require('../models/categoryBookModel');

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

module.exports = {
    createCategoryBook,
    getCategoryBooks
}