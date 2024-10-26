const express = require('express');
const {  getAllUsers,
    register,
    sendRegisterOTP,
    sendForgetPasswordOTP,
    changePassword,
    login,
    deleteAllUsers} = require('../controllers/authController');

const router = express.Router();

router.get('/get-all-users', getAllUsers)

router.post('/send-register-otp', sendRegisterOTP)
router.post('/register', register)

router.put('/login', login)

router.post('/send-forget-pass-otp', sendForgetPasswordOTP)
router.put('/change-password', changePassword)

router.delete('/delete_all_users', deleteAllUsers)

module.exports = router;