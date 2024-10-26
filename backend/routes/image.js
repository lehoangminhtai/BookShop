const express = require('express');
const {createImage}  = require('../controllers/image');

const imageRoute = express.Router();

// http://localhost:5000/api/videos/
imageRoute.post("/", createImage);

module.exports = imageRoute;