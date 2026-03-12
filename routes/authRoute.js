const express = require("express");
const { login, createLoginToken, sendOTP } = require("../controllers/Auth");
const limiter = require("../middlewares/rateLimiter");
const router = express.Router();

// LIMITER 
const createLoginTokenLimit = limiter(2)

router.post("/send-otp", limiter(10), sendOTP)
router.post("/login", createLoginTokenLimit, login);




module.exports = router;
