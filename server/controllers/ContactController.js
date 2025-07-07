import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { userId } = req;
    const { searchTerm } = req.body;

    const users = await User.find({
      _id: { $ne: new mongoose.Types.ObjectId(userId) }, // exclude self
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("firstName lastName email image color");

    return res.status(200).json({ contacts: users });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return res.status(500).send("Internal server error");
  }
};

export const getContactsForDmList = async (request, response, next) => {
  try {
    let { userId } = request;
    userId = new mongoose.Types.ObjectId(userId);
    console.log("userId:", request.userId); // or req.userId

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Something went wrong.");
  }
};
