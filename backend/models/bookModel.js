const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images:{
        type: [String],
        required:false
    },
    publisher:{
        type: String,
        required: true
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'CategoryBook',
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Book', bookSchema);

