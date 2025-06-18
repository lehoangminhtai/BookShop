const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController')

router.get('/report-today', reportController.calculateTodayRevenue)

router.get('/report', reportController.calculateRevenue)

router.get('/revenue-week', reportController.getOrderRevenueData)

router.get('/users-week', reportController.calculateWeeklyUserRegistrations)

router.get('/orders-week', reportController.getOrderCountData)

router.get('/top-books', reportController.getTopBooks)

router.get('/top-customers', reportController.getTopCustomers)

router.post('/revenue-detail', reportController.getOrderRevenueDataDetail)

module.exports = router;