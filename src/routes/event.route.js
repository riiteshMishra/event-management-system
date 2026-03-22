const express = require("express");
const rateLimiter = require("../middlewares/rateLimiter");
const { auth, isAdmin, isGramPradhan } = require("../middlewares/auth");
const {
    getEvents,
    createEvent,
    updateEvent,
    getEventBySlug,
    deleteEvent
} = require("../controllers/event.controller");
const { createCandidate, updateCandidate } = require("../controllers/candidate.controller");

const router = express.Router();

// Create event (auth required)
router.post("/events", rateLimiter(10), auth, createEvent);

// Update event (auth + role check)
router.patch("/events/:eventId", rateLimiter(10), auth, isAdmin, updateEvent);

// Get all events (public)
router.get("/events", rateLimiter(), getEvents);

// Get event by slug (public)
router.get("/events/slug/:slug", rateLimiter(), getEventBySlug);

// Delete event (admin only)
router.delete("/events/:eventId", auth, isAdmin, deleteEvent);


// ====================== CANDIDATE ======================
router.post("/candidate", rateLimiter(), auth, createCandidate)
router.patch("/candidate", rateLimiter(), auth, updateCandidate)

module.exports = router;