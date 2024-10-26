const Image = require('../models/images');
 const createImage = async (req, res, next) => {
  const { imgUrl } = req.body;

  if (!imgUrl) {
    res.status(400);
    return next(new Error("imgUrl fields are required"));
  }

  try {
    const image = await Image.create({
      imgUrl,
    });

    res.status(201).json({
      success: true,
      image,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
}

module.exports= {
  createImage
}