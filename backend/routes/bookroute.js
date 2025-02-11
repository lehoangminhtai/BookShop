const express = require('express');
const {createBook, getBook, getBooks, deleteBook,updateBook, searchBooks}  = require('../controllers/bookController');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/',getBooks);

router.get('/search',searchBooks);


router.get('/:id',getBook);


router.post('/',auth,createBook);

router.delete('/:id',deleteBook);

router.put('/:bookId',auth,updateBook)


module.exports = router;