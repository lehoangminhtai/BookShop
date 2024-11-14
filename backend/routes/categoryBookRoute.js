const express = require('express');

const { createCategoryBook, getCategoryBooks , getCategoryWithBookCount} = require('../controllers/categoryBookController')

const categoryBookRouter = express.Router();

categoryBookRouter.get('/',getCategoryBooks);

categoryBookRouter.post('/',createCategoryBook);

categoryBookRouter.get('/count-book',getCategoryWithBookCount);

module.exports = categoryBookRouter;