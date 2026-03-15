const express = require("express");
const { auth } = require("../middlewares/auth");
const rateLimiter = require("../middlewares/rateLimiter");
const { updateAvatar } = require("../controllers/Profile");
const router = express.Router();


router.post("/update-avatar", rateLimiter(10), auth, updateAvatar);



module.exports = router