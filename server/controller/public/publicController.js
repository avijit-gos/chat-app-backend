/** @format */

const createError = require("http-errors");
const {
  registerNewUser,
  loginUser,
} = require("../../model/userModel/userModel");

class PublicController {
  constructor() {}

  async register(req, res, next) {
    try {
      const { email, username, password, name } = req.body;
      if (
        !email.trim() ||
        !username.trim() ||
        !password.trim() ||
        !name.trim()
      ) {
        throw createError.BadRequest("All the fields are required");
      } else {
        const data = await registerNewUser(req.body);
        return res.status(201).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { logUser, password } = req.body;
      if (!logUser.trim() || !password.trim()) {
        throw createError.BadRequest("All the fields are required");
      } else {
        const data = await loginUser(req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
