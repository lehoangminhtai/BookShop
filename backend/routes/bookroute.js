const express = require('express');
const {createBook, getBook, getBooks, deleteBook,updateBook}  = require('../controllers/bookController');
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const Book = require('../models/bookModel');

const router = express.Router();

router.get('/',getBooks);

//get single

router.get('/:id',getBook);

router.post('/',createBook);
// router.post('/', async (req, res, next) => {
//     const { title, author, description,images, publisher, categoryId } = req.body;

//     try {
//         const result = await cloudinary.uploader.upload(images, {
//             folder: "uploads",
//             // width: 300,
//             // crop: "scale"
//         })
//         const book = await Book.create({
//             title,
//             author,
//             description,
//             images: result.secure_url,
//             publisher,
//             categoryId
//         });
//         res.status(201).json({
//             success: true,
//             book
//         })

//     } catch (error) {
//         console.log(error);
//         next(error);

//     }
//   });

router.delete('/:id',deleteBook);

//router.patch('/:id', updateBook);


module.exports = router;