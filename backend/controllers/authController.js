const { logAction } = require('../middleware/logMiddleware.js');
const User = require('../models/userModel.js');
const OTP = require('../models/otp.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const Log = require('../models/Log');

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
        if (!email) return res.status(400).json({ message: 'Email bắt buộc', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })


        const isEmailAlreadyReg = await User.findOne({ email })
        // in register user should not be registered already
        if (isEmailAlreadyReg) return res.status(400).json({ message: `Người dùng với ${email} đã đăng kí `, success: false })



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
            subject: 'Xác thực Đăng Ký',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .email-container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                padding: 20px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            .email-header {
                                background-color: #007bff;
                                color: #ffffff;
                                padding: 20px;
                                text-align: center;
                                border-radius: 8px 8px 0 0;
                            }
                            .email-header h1 {
                                margin: 0;
                                font-size: 24px;
                            }
                            .email-body {
                                padding: 20px;
                            }
                            .otp-code {
                                font-size: 32px;
                                font-weight: bold;
                                color: #333333;
                                background-color: #f8f8f8;
                                padding: 10px;
                                border-radius: 5px;
                                text-align: center;
                                margin: 20px 0;
                            }
                            .footer {
                                font-size: 12px;
                                color: #888888;
                                text-align: center;
                                margin-top: 20px;
                            }
                            .footer a {
                                color: #007bff;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1>Xác thực tài khoản</h1>
                            </div>
                            <div class="email-body">
                                <p>Thân gửi <strong>${email}</strong>,</p>
                                <p>Cảm ơn bạn đã đăng ký! Để hoàn tất đăng ký, vui lòng sử dụng mã One-Time Password (OTP) sau:</p>
                                <div class="otp-code">
                                    ${otp}
                                </div>
                                <p>Mã OTP này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                            </div>
                            <div class="footer">
                                <p>Nếu bạn không yêu cầu email này, vui lòng bỏ qua hoặc<a href="#">liên hệ chúng tôi</a> để được hỗ trợ.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null        //console.log(info);
        });

        res.status(200).json({ result: newOTP, message: 'Đã gửi mã OTP đăng kí tài khoản', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'Lỗi máy chủ khi gửi OTP đăng kí', error, success: false })
    }
}


const register = async (req, res) => {
    try {
        const { name, email, phone, password, otp } = req.body
        if (!name || !email || !password || !otp) return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })


        const isEmailAlreadyReg = await User.findOne({ email })
        if (isEmailAlreadyReg) return res.status(400).json({ message: `Người dùng với ${email} đã đăng kí`, success: false })


        const otpHolder = await OTP.find({ email })
        if (otpHolder.length == 0) return res.status(400).json({ message: 'Bạn đã nhập mã OTP hết hạn', success: false })

        const register_otps = otpHolder.filter(otp => otp.name == 'register_otp')
        const findedOTP = register_otps[register_otps.length - 1]           // otp may be sent multiple times to the user. So there may be multiple otps with user email stored in dbs. But we need only last one.

        const plainOTP = otp
        const hashedOTP = findedOTP.otp

        const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP)
        const fullName = name;
        if (isValidOTP) {
            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({ fullName, email, phone, password: hashedPassword })

            await newUser.generateAuthToken()

            await OTP.deleteMany({ email: findedOTP.email })

            await newUser.save()
            await logAction(
                'Đăng ký',
                newUser._id,
                `Người dùng ${newUser.fullName} đăng ký với email: ${email}`
            );
            return res.status(200).json({ result: newUser, message: 'Đăng kí thành công', success: true })
        }
        else {
            return res.status(200).json({ message: 'Sai mã OTP', success: false })
        }

    }
    catch (error) {
        res.status(404).json({ message: 'Lỗi đăng kí người dùng', error, success: false })
    }
}




const login = async (req, res) => {
    try {
        const auth_token = 'auth_token'
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin đăng nhập', success: false })

        const emailValidationFailed = !validator.isEmail(email)
        if (emailValidationFailed) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })

        const existingUser = await User.findOne({ email })
       
       
        if (!existingUser) return res.status(400).json({ message: `Email chưa đăng ký`, success: false })
        

        if (existingUser.status === 'lock') {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.', success: false });
        }
        
        const plainPassword = password;
        const hashedPassword = existingUser?.password;
        const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword);
        if (!isPasswordCorrect) return res.status(400).json({ message: `Sai mật khẩu`, success: false });
        await logAction(
            'Đăng nhập',
            existingUser._id,
            `${existingUser.role === 0 ? 'Người dùng' : 'Quản trị viên'} ${existingUser.fullName} đăng nhập với email: ${email}`
        );
        const isTokenExist = Boolean(existingUser?.tokens?.find(token => token.name == auth_token))
        if (isTokenExist) return res.status(201).json({ result: existingUser, message: `Người dùng với ${email} đã đăng nhập`, success: true });
        const token = jwt.sign({ email, password, _id: existingUser._id }, process.env.AUTH_TOKEN_SECRET_KEY);
        const tokenObj = { name: auth_token, token };
        existingUser.tokens = existingUser.tokens.push(tokenObj);
        
        
        const result = await User.findByIdAndUpdate(existingUser._id, existingUser, { new: true })


        res.status(200).json({ result, message: 'Đăng nhập thành thông', success: true })
    }
    catch (error) {
        res.status(404).json({ message: 'Lỗi máy chủ khi đăng nhập', error, success: false })
    }
}




const sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const isEmailAlreadyReg = await User.findOne({ email })

        if (!email) return res.status(400).json({ message: 'Vui lòng nhập email', success: false })
        // in forget password route, user should be registered already
        if (!isEmailAlreadyReg) return res.status(400).json({ message: `Người dùng chưa đăng kí với email: ${email}`, success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })

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
            subject: 'Xác thực quên mật khẩu',
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f4f4f4;
                            }
                            .email-container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                padding: 20px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            .email-header {
                                background-color: #007bff;
                                color: #ffffff;
                                padding: 20px;
                                text-align: center;
                                border-radius: 8px 8px 0 0;
                            }
                            .email-header h1 {
                                margin: 0;
                                font-size: 24px;
                            }
                            .email-body {
                                padding: 20px;
                            }
                            .otp-code {
                                font-size: 32px;
                                font-weight: bold;
                                color: #333333;
                                background-color: #f8f8f8;
                                padding: 10px;
                                border-radius: 5px;
                                text-align: center;
                                margin: 20px 0;
                            }
                            .footer {
                                font-size: 12px;
                                color: #888888;
                                text-align: center;
                                margin-top: 20px;
                            }
                            .footer a {
                                color: #007bff;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1>Xác thực tài khoản</h1>
                            </div>
                            <div class="email-body">
                                <p>Thân gửi <strong>${email}</strong>,</p>
                                <p>Cảm ơn bạn đã đăng ký! Để hoàn tất đăng ký, vui lòng sử dụng mã One-Time Password (OTP) sau:</p>
                                <div class="otp-code">
                                    ${otp}
                                </div>
                                <p>Mã OTP này có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                            </div>
                            <div class="footer">
                                <p>Nếu bạn không yêu cầu email này, vui lòng bỏ qua hoặc<a href="#">liên hệ chúng tôi</a> để được hỗ trợ.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err)
            else return null //console.log(info);
        });


        res.status(200).json({ result: newOTP, otp, message: 'Đã gửi OTP xác thực quên mật khẩu', success: true })

    }
    catch (error) {
        res.status(404).json({ message: 'Lỗi máy chủ khi gửi OTP sác thực quên mật khẩu', error, success: false })
    }
}





const changePassword = async (req, res) => {
    try {

        const { email, password, otp } = req.body
        if (!email || !password || !otp) return res.status(400).json({ message: 'Nhập đầy đủ thông tin', success: false })
        if (!validator.isEmail(email)) return res.status(400).json({ message: `Vui lòng nhập email hợp lệ`, success: false })


        const findedUser = await User.findOne({ email })
        if (!findedUser) return res.status(400).json({ message: `Người dùng với email: ${email} chưa đăng kí`, success: false })


        const otpHolder = await OTP.find({ email })
        if (otpHolder.length == 0) return res.status(400).json({ message: 'Bạn đã nhập OTP hết hạn', success: false })

        const forg_pass_otps = otpHolder.filter(otp => otp.name == 'forget_password_otp')         // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
        const findedOTP = forg_pass_otps[forg_pass_otps.length - 1]

        const plainOTP = otp
        const hashedOTP = findedOTP.otp

        const isValidOTP = await bcrypt.compare(plainOTP, hashedOTP)

        if (isValidOTP) {
            const hashedPassword = await bcrypt.hash(password, 12)
            const result = await User.findByIdAndUpdate(findedUser._id, { name: findedUser.name, email, password: hashedPassword }, { new: true })

            await OTP.deleteMany({ email: findedOTP.email })

            return res.status(200).json({ result, message: 'Đổi mật khẩu thành công', success: true })
        }
        else {
            return res.status(200).json({ message: 'Nhập sai OTP', success: false })
        }

    }
    catch (error) {
        res.status(404).json({ message: 'Lỗi máy chủ khi đổi mật khẩu', error, success: false })
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

const getBook = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return (res.status(404).json({ error: 'No such book' }));
    }
    const book = await Book.findById(id).populate('categoryId', 'nameCategory');

    if (!book) {
        return res.status(404).json({ error: 'No such book' });

    }
    res.status(200).json(book);
}
module.exports = {
    getAllUsers,
    register,
    sendRegisterOTP,
    sendForgetPasswordOTP,
    changePassword,
    login,
    deleteAllUsers
}