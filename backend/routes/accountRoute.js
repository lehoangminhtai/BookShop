const express = require('express');
const {getAllUsers, updateUser} = require('../controllers/accountController')


const router = express.Router();



router.put('/:id', updateUser);

router.get('/', getAllUsers);

module.exports = router