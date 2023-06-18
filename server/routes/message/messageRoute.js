/** @format */

const {
  createMessage,
  fetchMessages,
  deleteMessage,
  editMessage,
} = require("../../controller/message/messageController");

const router = require("express").Router();

// create new message
router.post("/create", createMessage);

// fetch all chat messages
router.get("/:id", fetchMessages);

// Delete message
router.delete("/delete/:id", deleteMessage);

// Edit message
router.put("/edit/:id", editMessage);

module.exports = router;
