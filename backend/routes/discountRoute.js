const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController'); // Đảm bảo đường dẫn đúng với controller của bạn
const auth = require('../middleware/auth')

router.post('/create', auth, discountController.createDiscount);

router.get('/', discountController.getAllDiscounts);

router.get('/available', discountController.getAvailableDiscounts);

router.post('/for-user', discountController.getDiscountsForUser);

router.post('/search', discountController.searchDiscountsForUser);

router.get('/:id', discountController.getDiscountById);



router.put('/:discountId', auth, discountController.updateDiscount);

router.delete('/:discountId', auth, discountController.deleteDiscount);

router.post('/apply', discountController.applyDiscount);


router.get('/unavailable', discountController.getUnavailableDiscounts);

module.exports = router;
