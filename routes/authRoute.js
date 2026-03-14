const express = require("express");
const { login, createLoginToken, sendOTP, signUp, changePassword } = require("../controllers/Auth");
const limiter = require("../middlewares/rateLimiter");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// LIMITER 
const createLoginTokenLimit = limiter(2)

router.post("/send-otp", limiter(2), sendOTP);
router.post("/sign-up", limiter(2,60), signUp)
router.post("/login", limiter(3), login);
router.post("/change-password", limiter(2), auth, changePassword)
router.post("/forgot-password", limiter(10))


module.exports = router;
