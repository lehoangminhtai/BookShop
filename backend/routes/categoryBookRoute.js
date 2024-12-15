const express = require('express');
const auth = require('../middleware/auth')

const { createCategoryBook, getCategoryBooks , getCategoryWithBookCount,getTopCategoryBooks, updateCategoryBook, deleteCategoryBook} = require('../controllers/categoryBookController')

const categoryBookRouter = express.Router();

categoryBookRouter.get('/',getCategoryBooks);

categoryBookRouter.get('/get-top-category',getTopCategoryBooks);

categoryBookRouter.post('/', auth, createCategoryBook);

categoryBookRouter.put('/:categoryId', auth, updateCategoryBook);

categoryBookRouter.get('/count-book',getCategoryWithBookCount);

categoryBookRouter.delete('/:categoryId',deleteCategoryBook);

module.exports = categoryBookRouter;