const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const defaultImage = [
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976349/d5c54be7-3833-4dee-9e16-8a819292b530_jsbleb.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976349/1572162a-416a-4d01-81e3-2af257e7d610_x7ikrh.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976349/d3801180-2d2c-4863-a5bd-edb5ba137583_npy7ew.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976349/Judgmental_Duck___Digital_Print_sw6rvv.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976348/daff5666-3e5e-46e6-a537-2789214f8949_qrqayy.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976348/Doodles_Bonitos_dacx24.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976348/0f841620-333d-4617-b327-c575bd863b08_svk7tr.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976348/5b5fa447-d651-48e5-8906-7d99e8f6db41_acaczm.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976348/ctp665ybnijy5s4djjxw.jpg',
    'https://res.cloudinary.com/dyu419id3/image/upload/v1727976347/3385cb96-00a8-4359-b134-b00ad217b3a4_yraftq.jpg'
];
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

const userSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: [true, 'Please add a Name'],
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please add a E-mail'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid E-mail'
        ]

    },
    phone: {
        type: String,
        required: true,
        match: [/^\d+$/, 'Phone number should contain only digits']  // Ràng buộc phone chỉ có chữ số
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return passwordRegex.test(v);
            },
            message: props => `Password phải có ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số, và kí tự đặc biệt!`
        }
    },
    // password: {
    //     type: String,
    //     trim: true,
    //     required: [true, 'Please add a Password'],
    //     minlength: [8, 'Password must be at least 8 characters'],
    //     match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
    //         'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character']

    // },

    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: function () {
            return defaultImage[Math.floor(Math.random() * defaultImage.length)];
        }
    },
    dateOfBirth: {
        type: Date,

    },
    role: {
        type: Number,
        default: 0,
    },
    grade: {
        type: Number,
        default: 0,

    },
    tokens: {
        type: [{ name: String, token: String }],
        required: true
    },
});


userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        password: this.password
    }, process.env.AUTH_TOKEN_SECRET_KEY)

    const index = this.tokens.findIndex(token => token.name == 'auth_token')

    if (index == -1) this.tokens = this.tokens.concat({ name: 'auth_token', token })        // auth_token should only be 1

    return token
}

module.exports = mongoose.model('User', userSchema);
