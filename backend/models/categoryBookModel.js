const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoryBookSchema = new Schema(
    {
        nameCategory: {
            type: String,
            required: true // Sửa "require" thành "required"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('CategoryBook', categoryBookSchema);
