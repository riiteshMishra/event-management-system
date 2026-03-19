const express = require("express");
const rateLimiter = require("../middlewares/rateLimiter");
const { auth } = require("../middlewares/auth");
const { createElection } = require("../controllers/Election System/election.controller");


const router = express.Router();

router.post("/create-election", rateLimiter(), auth, createElection)

module.exports = router;
