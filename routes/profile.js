const express = require("express");
const { auth, isSuperAdmin, isGramPradhan, isAdmin } = require("../middlewares/auth");
const rateLimiter = require("../middlewares/rateLimiter");
const { updateAvatar, updateProfile, updateAddress, GetUsers, getAllUsers, getUserById, getUserAddress, getUserProfile, toggleUserActivation, } = require("../controllers/Profile");
const router = express.Router();


router.post("/update-avatar", rateLimiter(10), auth, updateAvatar);
router.post("/update-profile", auth, updateProfile);
router.post("/update-address", auth, updateAddress);
// router.get("/get-users", rateLimiter(10), auth, isSuperAdmin, GetUsers)
router.get("/get-all-users", rateLimiter(2), getAllUsers);
router.get("/get-user/:userId", rateLimiter(10), getUserById);
router.get("/get-user-address/:userId", rateLimiter(10), getUserAddress)
router.get("/get-user-profile/:userId", rateLimiter(10), getUserProfile);
router.post("/toggle-user-activation", rateLimiter(10), auth, isAdmin, toggleUserActivation);

module.exports = router