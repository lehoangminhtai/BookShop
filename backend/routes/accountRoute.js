const express = require('express');
const {getAllUsers, updateUser, getUser} = require('../controllers/accountController')


const router = express.Router();



router.put('/:userId', updateUser);

router.get('/', getAllUsers);

router.get('/user/:userId', getUser);

module.exports = router