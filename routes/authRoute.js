const express = require("express");
const { login, sendOTP, signUp, changePassword, generateResetPasswordToken, forgotPassword } = require("../controllers/Auth");
const limiter = require("../middlewares/rateLimiter");
const { auth } = require("../middlewares/auth");

const router = express.Router();

// OTP
router.post("/send-otp", limiter(2), sendOTP);

// SIGN UP
router.post("/sign-up", limiter(2, 60), signUp);

// LOGIN
router.post("/login", limiter(3), login);

// CHANGE PASSWORD
router.post("/change-password", limiter(2), auth, changePassword);

// FORGOT PASSWORD
router.post("/generate-reset-password-token", limiter(1, 1), generateResetPasswordToken);

// RESET PASSWORD
router.post("/reset-password/:token", limiter(1, 1), forgotPassword);

module.exports = router;