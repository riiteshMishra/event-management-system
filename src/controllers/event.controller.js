const mongoose = require("mongoose");
const Event = require("../models/Event.model");
const { EVENTS } = require("../utils/helper");
const AppError = require("../utils/ApiError");

// Create Event
exports.createEvent = async (req, res, next) => {
    try {
        // Extract data from request body
        let { title, description, type, state, district, village, startDate, endDate, instructions } = req.body;

        // Extract userId from auth middleware
        const { userId } = req.user;

        // Validate userId existence
        if (!userId)
            return next(new AppError("User ID not found", 404));

        // Validate userId format (MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(userId))
            return next(new AppError("Invalid User ID", 400));

        // Basic required fields validation
        if (
            !title ||
            !description ||
            !type ||
            !state ||
            !district ||
            !village ||
            !startDate ||
            !endDate ||
            !instructions ||
            (Array.isArray(instructions) && instructions.length === 0)
        )
            return next(new AppError("All Fields are required", 400));

        // Initialize empty event document
        const event = new Event({});

        // Sanitize and assign title
        event.title = title.toString().toLowerCase().trim();

        // Sanitize and assign description
        event.description = description.toString().toLowerCase().trim();

        // Normalize and validate type
        type = type.toString().toLowerCase().trim();
        if (!EVENTS.includes(type)) {
            return next(new AppError("Invalid Type, Please send valid data", 400));
        }
        event.type = type;

        // Sanitize location fields
        event.state = state.toString().toLowerCase().trim();
        event.district = district.toString().toLowerCase().trim();
        event.village = village.toString().toLowerCase().trim();

        // Assign creator
        event.createdBy = userId;

        // Normalize instructions (handle array + string)
        instructions = Array.isArray(instructions)
            ? instructions
                .filter(Boolean) // remove empty/null values
                .map(i => i.toString().toLowerCase().trim())
            : typeof instructions === "string"
                ? [instructions.toString().toLowerCase().trim()]
                : [];

        //    Instruction
        if (instructions.length === 0) {
            return next(new AppError("Instructions are required", 400));
        }

        event.instructions = instructions;

        // Convert dates (string → Date object)
        event.startDate = new Date(startDate);
        event.endDate = new Date(endDate);

        // Validate date format
        if (isNaN(event.startDate.getTime()) || isNaN(event.endDate.getTime())) {
            return next(new AppError("Invalid date format", 400));
        }

        // Validate logical date order
        if (event.startDate > event.endDate) {
            return next(new AppError("Start date must be before end date", 400));
        }

        // Check duplicate event
        const existingEvent = await Event.findOne({
            title: event.title,
            village: event.village,
            startDate: event.startDate
        });

        // Duplicate check intentionally disabled
        if (existingEvent) {
            return next(new AppError("Event already exists", 400));
        }

        // Assign thumbnail based on type
        const thumbnailMap = {
            election: "https://picsum.photos/seed/election/600/400",
            party: "https://picsum.photos/seed/party/600/400",
            meeting: "https://picsum.photos/seed/meeting/600/400",
            function: "https://picsum.photos/seed/function/600/400",
            festival: "https://picsum.photos/seed/festival/600/400"
        };

        event.thumbnail = thumbnailMap[type];


        // SLUG - for SEO
        event.slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

        // Save event to database
        await event.save();

        // Dynamic success message
        const message = `${type.charAt(0).toUpperCase() + type.slice(1)} created`;

        // Send response
        return res.status(201).json({
            success: true,
            message,
            data: event,
        });

    } catch (err) {
        console.log("Error While Creating Event", err);
        return next(err);
    }
};

// Get Events
exports.getEvents = async (req, res, next) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });

        const now = new Date();

        function getEventStatus(event) {
            if (now < event.startDate) return "upcoming";
            if (now >= event.startDate && now <= event.endDate) return "active";
            return "completed";
        }

        const updatedEvents = events.map(event => ({
            ...event.toObject(),
            status: getEventStatus(event)
        }));

        return res.status(200).json({
            success: true,
            message: "all events fetched",
            data: updatedEvents
        });

    } catch (err) {
        console.log("Error while Getting Events", err);
        return next(err);
    }
};