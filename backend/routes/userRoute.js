const express = require('express');
const {  getAllUsers,
    register,
    sendRegisterOTP,
    sendForgetPasswordOTP,
    changePassword,
    login,
    deleteAllUsers} = require('../controllers/authController');
const UserController = require('../controllers/userController')

const router = express.Router();

router.get('/get-all-users', UserController.getAllUser)
router.get('/search-user', UserController.searchUsers)

router.post('/filter-users', UserController.getFilterUser)

router.post('/create-user', UserController.createUser)

router.post('/send-register-otp', sendRegisterOTP)
router.post('/register', register)

router.put('/login', login)

router.put('/:userId', UserController.updateUser);

router.post('/send-forget-pass-otp', sendForgetPasswordOTP)
router.put('/change-password', changePassword)

router.delete('/delete_all_users', deleteAllUsers)

module.exports = router;