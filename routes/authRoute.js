const express = require("express");
const { login, createLoginToken } = require("../controllers/Auth");
const limiter = require("../middlewares/rateLimiter");
const router = express.Router();

// LIMITER 
const createLoginTokenLimit = limiter(2)

router.post("/create-login-token", createLoginTokenLimit, createLoginToken)
router.post("/login", createLoginTokenLimit, login);




module.exports = router;
