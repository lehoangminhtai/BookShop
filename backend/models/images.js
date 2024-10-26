const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    imgUrl: {
        type: String,
        required: true,
      }
},{timestamps:true}
);
const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;