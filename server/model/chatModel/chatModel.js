/** @format */

const mongoose = require("mongoose");
const createError = require("http-errors");
const Message = require("../../schemas/message/messageSchema");
const Chat = require("../../schemas/chat/chatSchema");
const Notification = require("../../schemas/notifications/notifications");
const User = require("../../schemas/user/userSchema");
const { uploadImage } = require("../../helper/helper");
const {
  saveNewNotification,
} = require("../notificationModel/notificationModel");

class ChatModel {
  constructor() {}

  // *** Create a single one to one chat
  async createOneToOneChat(data, user) {
    console.log(data.profileId);
    const isChat = await Chat.find({
      isGroup: false,
      $and: [
        { mem: { $elemMatch: { $eq: data.profileId } } },
        { mem: { $elemMatch: { $eq: user._id } } },
      ],
    })
      .populate("mem", "-password")
      .populate("latestMsg");
    console.log("Chat length: ", isChat.length);
    if (isChat.length === 0) {
      const chatData = await Chat({
        _id: new mongoose.Types.ObjectId(),
        mem: [data.profileId, user._id],
      });
      const chat = await chatData.save();
      const result = await Chat.findById(chat._id).populate("mem", "-password");
      return result;
    } else {
      return isChat;
    }
  }

  // *** Fetch chats
  async fetchChatData(userId) {
    const data = await Chat.find({ mem: userId })
      .populate("mem", "-password")
      .populate("latestMsg")
      .sort({ createdAt: -1 });
    return data;
  }

  // *** Create new group chat
  async createNewGroupChat(data, user) {
    var members = JSON.parse(data.members);
    members.push(user._id);
    const groupData = Chat({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      mem: members,
      isGroup: true,
      creator: user._id,
    });
    const group = await groupData.save();
    const result = await Chat.findById(group._id).populate("mem", "-password");
    return result;
  }

  // *** Fetch single chat
  async fetchSingleChatById(id) {
    const data = await Chat.findById(id).populate("mem", "-password");
    return data;
  }

  // *** Update group details
  async updatedGroupDetails(id, data, file) {
    var url;
    if (file) {
      const result = await uploadImage(file.image);
      url = result.url;
    }
    const updatedData = await Chat.findByIdAndUpdate(
      id,
      {
        $set: { name: data.name, bio: data.bio, profilePic: url || "" },
      },
      { new: true }
    );
    return updatedData;
  }

  async updateGroupMemebers(id, data) {
    const chat = await Chat.findById(id);
    const isMemebers = chat.mem && chat.mem.includes(data.userId);
    const options = !isMemebers ? "$addToSet" : "$pull";

    const updatedResult = await Chat.findByIdAndUpdate(
      id,
      { [options]: { mem: data.userId } },
      { new: true }
    );
    try {
      const user = await User.findById(data.userId).select("-password");
      return { user: user, result: updatedResult };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async deleteChatDetails(id) {
    const chat = await Chat.findByIdAndDelete(id);
    try {
      const messages = await Message.deleteMany({ chatId: id });
      try {
        return "Chat has been deleted";
      } catch (error) {
        throw createError.BadRequest(error.message);
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async fetchSearchChat(data) {
    const result = await Chat.find({
      $and: [
        { name: { $regex: data.search, $options: "i" } },
        { isGroup: true },
      ],
    }).populate("latestMsg");
    try {
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async joinChatGroup(id, userId) {
    const chat = await Chat.findById(id);
    const isRequested = chat.request && chat.request.includes(userId);
    const options = isRequested ? "$pull" : "$addToSet";

    const result = await Chat.findByIdAndUpdate(
      id,
      { [options]: { request: userId } },
      { new: true }
    );
    try {
      // return result;
      const data = await saveNewNotification(
        userId,
        id,
        chat.creator.toString()
      );
      try {
        return { result, notification: data };
      } catch (error) {
        throw createError.BadRequest(error.message);
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async fetchJoingRequestUsers(id) {
    const chat = await Chat.findById(id).populate("request", "-password");
    try {
      return chat;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async acceptJoin(id, userId, notiId) {
    console.log("Not ID: ", notiId);
    const result = await Chat.findByIdAndUpdate(
      id,
      { $pull: { request: userId } },
      { new: true }
    );

    const updateChat = await Chat.findByIdAndUpdate(
      id,
      { $addToSet: { mem: userId } },
      { new: true }
    );

    try {
      const notiData = await Notification.findByIdAndUpdate(
        notiId,
        {
          $set: { isViewed: true },
        },
        { new: true }
      );
      try {
        return updateChat;
      } catch (error) {
        throw createError.BadRequest(error.message);
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async removeJoin(id, userId, notiId) {
    console.log("Not ID: ", notiId);
    const result = await Chat.findByIdAndUpdate(
      id,
      { $pull: { request: userId } },
      { new: true }
    );

    try {
      const notiData = await Notification.findByIdAndUpdate(
        notiId,
        {
          $set: { isViewed: true },
        },
        { new: true }
      );
      try {
        return result;
      } catch (error) {
        throw createError.BadRequest(error.message);
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async updatePrivacySettings(id, data) {
    const update = await Chat.findByIdAndUpdate(id, {
      $set: { msg_prvacy: data.privacy },
    });
    try {
      return update;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new ChatModel();
