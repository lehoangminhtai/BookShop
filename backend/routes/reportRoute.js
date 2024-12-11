const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController')

router.get('/report-today', reportController.calculateTodayRevenue)

router.get('/revenue-week', reportController.getOrderRevenueData)

router.get('/users-week', reportController.calculateWeeklyUserRegistrations)

module.exports = router;