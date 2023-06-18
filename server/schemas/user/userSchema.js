/** @format */

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, trim: true, require: true },
    bio: { type: String, default: "" },
    email: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      trim: true,
      require: true,
      unique: true,
      index: true,
    },
    profilePic: { type: String, default: "" },
    password: { type: String, require: true },
    tw: { type: String, default: "" },
    fb: { type: String, default: "" },
    link: { type: String, default: "" },
    c_link: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
