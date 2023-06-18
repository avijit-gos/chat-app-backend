/** @format */

const { register, login } = require("../../controller/public/publicController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
module.exports = router;
