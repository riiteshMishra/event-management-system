const express = require("express");
const { auth } = require("../middlewares/auth");
const rateLimiter = require("../middlewares/rateLimiter");
const { updateAvatar, updateProfile, updateAddress } = require("../controllers/Profile");
const router = express.Router();


router.post("/update-avatar", rateLimiter(10), auth, updateAvatar);
router.post("/update-profile", auth, updateProfile);
router.post("/update-address", auth, updateAddress);

module.exports = router