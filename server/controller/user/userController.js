/** @format */

const createError = require("http-errors");
const {
  searchUsers,
  fetchUserById,
  uploadProfileImage,
  updateUserInfo,
  updateProfileLinks,
} = require("../../model/userModel/userModel");
class UserController {
  constructor() {}

  async searchUser(req, res, next) {
    try {
      console.log(req.user);
      const data = await searchUsers(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch user details
  async fetchUser(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        const data = await fetchUserById(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Upload profile picture
  async uploadProfileImage(req, res, next) {
    try {
      const data = await uploadProfileImage(req.files, req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileName(req, res, next) {
    try {
      if (!req.body.name.trim()) {
        throw createError.BadRequest("Invalid name format");
      } else {
        const data = await updateUserInfo(req.body.name, "name", req.user._id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateProfileBio(req, res, next) {
    try {
      if (!req.body.bio.trim()) {
        throw createError.BadRequest("Invalid profile bio format");
      } else {
        const data = await updateUserInfo(req.body.bio, "bio", req.user._id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateLinks(req, res, next) {
    try {
      const data = await updateProfileLinks(req.body, req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
