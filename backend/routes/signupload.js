const express = require('express');
const { generateSignature } = require('../controllers/sign-upload');


const signRoute = express.Router(); // Tạo router với tên sign_upload

// http://localhost:5000/api/sign-upload
signRoute.post("/", generateSignature); 

module.exports = signRoute;

