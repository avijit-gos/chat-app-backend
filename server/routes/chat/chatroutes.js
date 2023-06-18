/** @format */

const {
  createSingleChat,
  getChat,
  createGroupChat,
  fetchSingleChat,
  updateGroup,
  removeMemebrs,
  addMembers,
  deleteChat,
  searchChat,
  requestToJoin,
  fetchJoinRequests,
  acceptJoinRequest,
  removeJoinRequest,
  updateGroupPrivacy,
} = require("../../controller/chat/chatController");

const router = require("express").Router();

// Create single one to one chat
router.post("/", createSingleChat);

router.get("/search_chat", searchChat);

// Fetch chats
router.get("/", getChat);

// create group chat
router.post("/group", createGroupChat);

// Fetch single chat
router.get("/:id", fetchSingleChat);

// Add new members
router.put("/add/members/:id", addMembers);

// Remove members
router.put("/remove/members/:id", removeMemebrs);

// Update group details
router.put("/update/:id", updateGroup);

// Delete group
router.delete("/delete/:id", deleteChat);

// Request to join the chat group
router.put("/request/join/:id", requestToJoin);

// Fetch joining requests
router.get("/request/join/:id", fetchJoinRequests);

// Accept join request
router.put("/accept/join/:id", acceptJoinRequest);

// Remove join request
router.put("/remove/join/:id", removeJoinRequest);

// Remove join request
router.put("/remove/join/:id", removeJoinRequest);

// Update group privacy
router.put("/update/privacy/:id", updateGroupPrivacy);

module.exports = router;
