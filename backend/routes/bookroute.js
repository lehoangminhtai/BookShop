const express = require('express');
const {createBook, getBook, getBooks, deleteBook,updateBook}  = require('../controllers/bookController');

const router = express.Router();

router.get('/',getBooks);


router.get('/:id',getBook);

router.post('/',createBook);

router.delete('/:id',deleteBook);

router.put('/:bookId',updateBook)


module.exports = router;