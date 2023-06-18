/** @format */

const {
  searchUser,
  fetchUser,
  uploadProfileImage,
  updateProfileName,
  updateProfileBio,
  updateLinks,
} = require("../../controller/user/userController");

const router = require("express").Router();

// upload profile picture
router.post("/upload/picture/:id", uploadProfileImage);

// update profile name
router.post("/update/name", updateProfileName);

// update profile bio
router.post("/update/bio", updateProfileBio);

// edit profile links
router.post("/update/links", updateLinks);
// search user
router.get("/search/user", searchUser);

// *** get user profile
router.get("/:id", fetchUser);
// delete user account
module.exports = router;
