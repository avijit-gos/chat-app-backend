/** @format */

const mongoose = require("mongoose");
const Message = require("../../schemas/message/messageSchema");
const Chat = require("../../schemas/chat/chatSchema");
const { uploadImage } = require("../../helper/helper");
const createError = require("http-errors");

class MessageModel {
  constructor() {}

  // *** create a new message
  async createNewMessage(file, data, user) {
    // *** image is present then first upload that image in cloud then save the url;
    var url = "";
    if (file) {
      const data = await uploadImage(file.image);
      url = data.url;
    }
    // *** Create mongoDB instance
    const newMessageData = Message({
      _id: new mongoose.Types.ObjectId(),
      text: data.text,
      image: url,
      sender: user._id,
      chatId: data.chatId,
    });
    // *** save mongoDB instance in Database
    const messageData = await newMessageData.save();

    const updatedChat = await Chat.findByIdAndUpdate(
      data.chatId,
      {
        $set: { latestMsg: messageData._id },
      },
      { new: true }
    );

    // *** Populating sender details without password
    const result = await messageData.populate("sender", "-password");
    const message = await result.populate("chatId");
    // *** returning the result
    return message;
  }

  // *** Fetch all messages related to chat
  async fetchMessagesData(id, page, limit) {
    const data = await Message.find({ chatId: id })
      .populate("sender", "-password")
      .sort({ createdAt: -1 })
      .populate("chatId")
      .limit(limit)
      .skip(limit * page);
    return data.reverse();
  }

  // *** Delete message by id
  async deleteMessageById(id) {
    const data = await Message.findByIdAndDelete(id);
    try {
      return data;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  // *** Update message
  async updateMessage(id, data) {
    const updateMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { text: data.content } },
      { new: true }
    );
    try {
      return updateMessage;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new MessageModel();
