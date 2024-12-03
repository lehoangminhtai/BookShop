const express = require('express');

const { createCategoryBook, getCategoryBooks , getCategoryWithBookCount, updateCategoryBook, deleteCategoryBook} = require('../controllers/categoryBookController')

const categoryBookRouter = express.Router();

categoryBookRouter.get('/',getCategoryBooks);

categoryBookRouter.post('/',createCategoryBook);

categoryBookRouter.put('/:categoryId',updateCategoryBook);

categoryBookRouter.get('/count-book',getCategoryWithBookCount);

categoryBookRouter.delete('/:categoryId',deleteCategoryBook);

module.exports = categoryBookRouter;