const express = require("express");
const rateLimiter = require("../middlewares/rateLimiter");
const { auth } = require("../middlewares/auth");
const { getEvents, createEvent, updateEvent } = require("../controllers/event.controller");


const router = express.Router();

router.post("/create-event", rateLimiter(), auth, createEvent);
router.patch("/update-event", auth, updateEvent);
router.get("/get-events", getEvents);



module.exports = router;
