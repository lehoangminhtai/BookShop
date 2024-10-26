
const User = require('../models/userModel.js');
const OTP = require('../models/otp.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

 const getAllUsers = async (req, res) => {
    try {
        const result = await User.find()
        res.status(200).json({ result, message: 'all users get successfully', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'error in getAllUsers - controllers/user.js', error, success: false })
    }
}




 const sendRegisterOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const isEmailAlreadyReg = await User.findOne({ email })
        // in register user should not be registered already
        if (isEmailAlreadyReg) return res.status(400).json({ message: `user with email ${email} already resgistered `, success: false })


        
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const hashedOTP = await bcrypt.hash(otp, 12)
        const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'register_otp' })

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verification',
            html: `<p>Your OTP code is ${otp}</p>`
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null        //console.log(info);
        });

        res.status(200).json({ result: newOTP, message: 'register_otp send successfully', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'error in sendRegisterOTP - controllers/user.js', error, success: false })
    }
}


const register = async (req, res) => {
    try {
        const {name, email, phone, password, address, otp } = req.body
        if (!name || !email || !password || !otp) return res.status(400).json({ message: 'make sure to provide all the fieds (name, email, password, otp)', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const isEmailAlreadyReg = await User.findOne({ email })
        if (isEmailAlreadyReg) return res.status(400).json({ message: `user with email ${email} already resgistered `, success: false })


        const otpHolder = await OTP.find({ email })
        if (otpHolder.length == 0) return res.status(400).json({ message: 'you have entered an exired otp', success: false })

        const register_otps = otpHolder.filter(otp => otp.name == 'register_otp')
        const findedOTP = register_otps[register_otps.length - 1]           // otp may be sent multiple times to the user. So there may be multiple otps with user email stored in dbs. But we need only last one.

        const plainOTP = otp
        const hashedOTP = findedOTP.otp

        const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP)
        const fullName = name;
        if (isValidOTP) {
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({ fullName, email, phone, password:hashedPassword , address })

            await newUser.generateAuthToken()

            await OTP.deleteMany({ email: findedOTP.email })

            await newUser.save()
            return res.status(200).json({ result: newUser, message: 'register successfully', success: true })
        }
        else {
            return res.status(200).json({ message: 'wrong otp', success: false })
        }

    }
    catch (error) {
        res.status(404).json({ message: 'error in register - controllers/user.js', error, success: false })
    }
}




 const login = async (req, res) => {
    try {
        const auth_token = 'auth_token'
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'make sure to provide all fields (email, password) ', success: false })

        const emailValidationFailed = !validator.isEmail(email)
        if (emailValidationFailed) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })

        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(400).json({ message: `Invalid Credentials`, success: false })

        const plainPassword = password
        const hashedPassword = existingUser?.password
        const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword)
        if (!isPasswordCorrect) return res.status(400).json({ message: `Invalid Credentials`, success: false })

        const isTokenExist = Boolean(existingUser?.tokens?.find(token => token.name == auth_token))
        if (isTokenExist) return res.status(201).json({ result: existingUser, message: `user with email ${email} already loged in`, success: true })

        const token = jwt.sign({ email, password, _id: existingUser._id }, process.env.AUTH_TOKEN_SECRET_KEY)
        const tokenObj = { name: auth_token, token }
        existingUser.tokens = existingUser.tokens.push(tokenObj)
        const result = await User.findByIdAndUpdate(existingUser._id, existingUser, { new: true })

        res.status(200).json({ result, message: 'login successfully', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'login failed - controllers/user.js', error, success: false })
    }
}




 const sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const isEmailAlreadyReg = await User.findOne({ email })

        if (!email) return res.status(400).json({ message: 'email field is required', success: false })
        // in forget password route, user should be registered already
        if (!isEmailAlreadyReg) return res.status(400).json({ message: `no user exist with email ${email}`, success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        const hashedOTP = await bcrypt.hash(otp, 12)
        const newOTP = await OTP.create({ email, otp: hashedOTP, name: 'forget_password_otp' })

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verification',
            html: `<p>Your OTP code is ${otp}</p>`      // all data to be sent
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null //console.log(info);
        });


        res.status(200).json({ result: newOTP, otp, message: 'forget_password_otp send successfully', success: true })

    }
    catch (error) {
        res.status(404).json({ message: 'error in sendForgetPasswordOTP - controllers/user.js', error, success: false })
    }
}





 const changePassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body
        if (!email || !password || !otp) return res.status(400).json({ message: 'make sure to provide all the fieds ( email, password, otp)', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `email pattern failed. Please provide a valid email.`, success: false })


        const findedUser = await User.findOne({ email })
        if (!findedUser) return res.status(400).json({ message: `user with email ${email} is not exist `, success: false })


        const otpHolder = await OTP.find({ email })
        if (otpHolder.length == 0) return res.status(400).json({ message: 'you have entered an expired otp', success: false })

        const forg_pass_otps = otpHolder.filter(otp => otp.name == 'forget_password_otp')         // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
        const findedOTP = forg_pass_otps[forg_pass_otps.length - 1]

        const plainOTP = otp
        const hashedOTP = findedOTP.otp

        const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP)

        if (isValidOTP) {
            const hashedPassword = await bcrypt.hash(password, 12)
            const result = await User.findByIdAndUpdate(findedUser._id, { name: findedUser.name, email, password: hashedPassword }, { new: true })

            await OTP.deleteMany({ email: findedOTP.email })

            return res.status(200).json({ result, message: 'password changed successfully', success: true })
        }
        else {
            return res.status(200).json({ message: 'wrong otp', success: false })
        }

    }
    catch (error) {
        res.status(404).json({ message: 'error in changePassword - controllers/user.js', error, success: false })
    }
}







 const deleteAllUsers = async (req, res) => {
    try {

        const result = await User.deleteMany()
        res.status(200).json({ result, message: `User collection deleted successfully `, success: true })

    }
    catch (err) {
        res.status(404).json({ message: 'error in deleteAllUsers - controllers/user.js', success: false })
    }
}

 const getBook = async (req,res) =>{
    const{id} =req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return(res.status(404).json({error: 'No such book'}));
    }
    const book = await Book.findById(id).populate('categoryId','nameCategory');

    if(!book){
        return res.status(404).json({error: 'No such book'});

    }
    res.status(200).json(book);
}
module.exports ={
    getAllUsers,
    register,
    sendRegisterOTP,
    sendForgetPasswordOTP,
    changePassword,
    login,
    deleteAllUsers
}