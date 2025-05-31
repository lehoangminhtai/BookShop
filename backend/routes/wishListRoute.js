const express = require('express');
const router = express.Router();
const { getWishlist,addToWishlist, removeFromWishlist,deleteWishlist} = require('../controllers/wishlistController')


router.get('/get-wishlist/:userId', getWishlist);
router.post('/add-to-wishlist', addToWishlist);
router.post('/remove-from-wishlist', removeFromWishlist);
router.delete('/delete-wishlist/:userId', deleteWishlist);

module.exports = router;
