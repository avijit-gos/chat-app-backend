/** @format */

const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
    mem: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    request: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    msg_prvacy: { type: String, default: "all" }, // All means every one, Members means only grolup members
    mem_privacy: { type: String, default: "all" },
    isGroup: { type: Boolean, default: false },
    creator: { type: mongoose.Schema.ObjectId, ref: "user" },
    latestMsg: { type: mongoose.Schema.ObjectId, ref: "message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
