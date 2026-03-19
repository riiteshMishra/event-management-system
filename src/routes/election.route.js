const express = require("express");
const rateLimiter = require("../middlewares/rateLimiter");
const { auth } = require("../middlewares/auth");
const { getEvents, createEvent } = require("../controllers/event.controller");


const router = express.Router();

router.post("/create-event", rateLimiter(), auth, createEvent)
router.get("/get-events", getEvents)
module.exports = router;
