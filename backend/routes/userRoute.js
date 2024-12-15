const express = require('express');
const auth = require('../middleware/auth')

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

router.post('/create-user',auth, UserController.createUser)

router.post('/send-register-otp', sendRegisterOTP)
router.post('/register', register)

router.put('/login', login)

router.put('/change-password', changePassword)

router.put('/update-user/:userId', auth, UserController.updateUser);

router.post('/send-forget-pass-otp', sendForgetPasswordOTP)


router.delete('/delete_all_users', deleteAllUsers)

module.exports = router;