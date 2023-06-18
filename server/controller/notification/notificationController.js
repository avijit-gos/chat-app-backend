/** @format */

const createError = require("http-errors");
const {
  fetchAllNotifications,
} = require("../../model/notificationModel/notificationModel");

class NotoficationController {
  constructor() {}

  async createNotification(req, res, next) {
    try {
      // const data = await
    } catch (error) {
      next(error);
    }
  }

  async fetchNotification(req, res, next) {
    try {
      const data = await fetchAllNotifications(req.user._id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotoficationController();
