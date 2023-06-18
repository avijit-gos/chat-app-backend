/** @format */

const createError = require("http-errors");
const {
  createNewMessage,
  fetchMessagesData,
  deleteMessageById,
  updateMessage,
} = require("../../model/messageModel/messageModel");

class MessageController {
  constructor() {}

  // *** create new message
  async createMessage(req, res, next) {
    try {
      console.log(req.files);
      console.log(req.body);
      const data = await createNewMessage(req.files, req.body, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch all messages
  async fetchMessages(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("No request parameter is not present");
      } else {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;
        const data = await fetchMessagesData(req.params.id, page, limit);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Delete message
  async deleteMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        const data = await deleteMessageById(req.params.id);
        return res.status(200).json({ msg: "Successfully deleted", data });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Edit message
  async editMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Request parameter is not present");
      } else if (!req.body.content.trim()) {
        throw createError.BadRequest("Invalid message format");
      } else {
        const data = await updateMessage(req.params.id, req.body);
        return res.status(200).json({ msg: "Message hs been updated", data });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
