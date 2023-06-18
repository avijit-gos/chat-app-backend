/** @format */

const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
    isViewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
