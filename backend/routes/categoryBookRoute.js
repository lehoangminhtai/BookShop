const express = require('express');

const { createCategoryBook, getCategoryBooks } = require('../controllers/categoryBookController')

const categoryBookRouter = express.Router();

categoryBookRouter.get('/',getCategoryBooks);

categoryBookRouter.post('/',createCategoryBook);

module.exports = categoryBookRouter;