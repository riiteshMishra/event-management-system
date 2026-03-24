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
const { createCandidate, updateCandidate, deleteCandidate, getCandidate, getCandidates } = require("../controllers/Election/candidate.controller");
const { createVote, getElectionResult } = require("../controllers/Election/vote.controller");

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
router.post("/candidate", rateLimiter(10, 1), auth, isAdmin, createCandidate)
router.patch("/candidate/:candidateId", rateLimiter(10, 1), auth, isAdmin, updateCandidate)
router.delete("/candidate/:candidateId", rateLimiter(10, 1), auth, isAdmin, deleteCandidate);
router.get("/candidate/:candidateId", rateLimiter(10, 1), getCandidate)
router.get("/candidates", rateLimiter(10, 1), getCandidates)


// ====================== ELECTION ======================
router.post("/vote/:candidateId", rateLimiter(), createVote)
router.get("/election/:eventId/result", rateLimiter(), getElectionResult)



module.exports = router;