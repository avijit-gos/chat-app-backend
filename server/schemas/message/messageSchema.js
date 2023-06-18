/** @format */

const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String },
    image: { type: String, default: "" },
    sender: { type: mongoose.Schema.ObjectId, ref: "user" },
    chatId: { type: mongoose.Types.ObjectId, ref: "chat" },
    pin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
