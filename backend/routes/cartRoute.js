const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth')


router.post('/create', cartController.createCart);


router.get('/:userId', auth, cartController.getCart);

router.post('/add',auth, cartController.addToCart);

router.put('/update',auth, cartController.updateCartItem);

router.delete('/:userId/remove/:bookId',auth, cartController.removeFromCart);

router.delete('/:userId/delete',auth, cartController.deleteCart);

module.exports = router;
