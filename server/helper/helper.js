/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
var CryptoJS = require("crypto-js");

class Helper {
  constructor() {}

  // create hash password
  async createHash(password) {
    const data = await bcrypt.hash(password, 10);
    return data;
  }

  async comparePassword(password, data) {
    const result = await bcrypt.compare(password, data.password);
    return result;
  }

  async createToken(data) {
    const token = await jwt.sign(
      {
        _id: data._id,
        name: data.name,
        email: data.email,
        username: data.username,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "30d" }
    );
    return token;
  }

  async uploadImage(file) {
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    try {
      return result;
    } catch (error) {
      return false;
    }
  }

  async hashMessageText(text) {
    var encryptText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      "mySecretKeyForTextMessage"
    ).toString();
    return encryptText;
  }
}

module.exports = new Helper();
