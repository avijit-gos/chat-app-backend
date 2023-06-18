/** @format */

const mongoose = require("mongoose");
const User = require("../../schemas/user/userSchema");
const createError = require("http-errors");
const {
  createHash,
  createToken,
  comparePassword,
  uploadImage,
} = require("../../helper/helper");

class UserModel {
  constructor() {}

  // register a new user
  async registerNewUser(data) {
    const isUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (isUser) {
      throw createError.BadRequest("Email or Username has already been taken");
    } else {
      const hash = await createHash(data.password);
      const userData = User({
        _id: new mongoose.Types.ObjectId(),
        name: data.name,
        email: data.email,
        username: data.username,
        password: hash,
      });

      const user = await userData.save();
      // create token
      const token = await createToken(user);
      return { user, token };
    }
  }

  async loginUser(data) {
    const isUser = await User.findOne({
      $or: [{ email: data.logUser }, { username: data.logUser }],
    });
    if (!isUser) {
      throw createError.BadRequest(
        "User does not exists with this credentials"
      );
    } else {
      const result = await comparePassword(data.password, isUser);
      if (!result) {
        throw createError.BadRequest("Password is not correct");
      } else {
        const token = await createToken(isUser);
        return { user: isUser, token: token };
      }
    }
  }

  async searchUsers(data, user) {
    const searchTerm = data.search
      ? {
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { username: { $regex: data.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchTerm)
      .find({
        _id: { $ne: user._id },
      })
      .select(["_id", "name", "username", "profilePic"]);
    return users;
  }

  async fetchUserById(id) {
    const data = await User.findById(id).select("-password");
    return data;
  }

  async uploadProfileImage(file, id) {
    // upload image in cloudinary
    const data = await uploadImage(file.image);
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { profilePic: data.url } },
      { new: true }
    );
    const token = await createToken(user);
    return { user, token };
  }

  async updateUserInfo(data, value, id) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { [value]: data } },
      { new: true }
    );
    const token = await createToken(user);
    try {
      return { user, token };
    } catch (error) {
      return error;
    }
  }

  async updateProfileLinks(data, userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          tw: data.tw,
          fb: data.fb,
          link: data.link,
          c_link: data.c_link,
        },
      },
      { new: true }
    );
    try {
      return user;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}
module.exports = new UserModel();
