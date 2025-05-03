const express = require('express')

const {summarizeBook} = require('../../controllers/AI/summarizeBook')

const router = express.Router();
router.post('/', summarizeBook)

module.exports = router