/** @format */

const {
  createNotification,
  fetchNotification,
} = require("../../controller/notification/notificationController");

const router = require("express").Router();

// create notofication
router.post("/", createNotification);

// fetch all notification
router.get("/", fetchNotification);

module.exports = router;
