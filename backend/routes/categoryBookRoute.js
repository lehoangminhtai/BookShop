const express = require('express');
const auth = require('../middleware/auth')

const { createCategoryBook, getCategoryBooks , getCategoryWithBookCount, updateCategoryBook, deleteCategoryBook} = require('../controllers/categoryBookController')

const categoryBookRouter = express.Router();

categoryBookRouter.get('/',getCategoryBooks);

categoryBookRouter.post('/', auth, createCategoryBook);

categoryBookRouter.put('/:categoryId', auth, updateCategoryBook);

categoryBookRouter.get('/count-book',getCategoryWithBookCount);

categoryBookRouter.delete('/:categoryId',deleteCategoryBook);

module.exports = categoryBookRouter;