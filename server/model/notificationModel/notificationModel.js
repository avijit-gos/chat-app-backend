/** @format */
const createError = require("http-errors");
const mongoose = require("mongoose");
const Notification = require("../../schemas/notifications/notifications");

class NotificationModel {
  constructor() {}

  async saveNewNotification(senderId, chatId, creatorId) {
    console.log("creatorId = ", creatorId);
    const notificationData = Notification({
      _id: new mongoose.Types.ObjectId(),
      sender: senderId,
      receiver: creatorId,
      chat: chatId,
    });
    console.log(notificationData);

    const data = await notificationData.save();
    const notification = await Notification.findById(data._id)
      .populate("sender", "-password")
      .populate("receiver", "-password")
      .populate("chat");
    return notification;
  }

  async fetchAllNotifications(userId) {
    const data = await Notification.find({ receiver: userId })
      .populate("sender", "-password")
      .populate("receiver", "-password")
      .populate("chat")
      .sort({ createdAt: -1 });
    try {
      return data;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new NotificationModel();
