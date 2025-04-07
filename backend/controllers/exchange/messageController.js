const User = require("../../models/userModel");
const Message = require("../../models/exchange/messageModel");

const cloudinary = require("../../utils/cloudinary");
const { getReceiverSocketId, io } = require("../../utils/socket");

const mongoose = require("mongoose");
const getUsersForSidebar = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.aggregate([
      {
          $match: {
              $or: [
                  { senderId: new mongoose.Types.ObjectId(userId) },
                  { receiverId: new mongoose.Types.ObjectId(userId) }
              ]
          }
      },
      {
          $project: {
              otherUserId: {
                  $cond: [
                      { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
                      "$receiverId",
                      "$senderId"
                  ]
              }
          }
      },
      {
          $group: {
              _id: "$otherUserId"
          }
      },
      {
          $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'userDetails'
          }
      },
      {
          $unwind: "$userDetails"
      },
      {
          $project: {
              _id: "$userDetails._id",
              fullName: "$userDetails.fullName",
              image: "$userDetails.image",
          }
      }
  ]);

  res.status(200).json({success: true, data: messages});
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;


    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId, senderId } = req.params;

    if (!text && !image) {
      return res.status(200).json({ success: false, error: "Message text or image is required" });
    }
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};