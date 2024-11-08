const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/create', cartController.createCart);


router.get('/:userId', cartController.getCart);

router.post('/add', cartController.addToCart);

router.put('/update', cartController.updateCartItem);

router.delete('/:userId/remove/:bookId', cartController.removeFromCart);

router.delete('/:userId/delete', cartController.deleteCart);

module.exports = router;
