const mongoose = require("mongoose");
const Event = require("../models/Event.model");
const { EVENTS, dateHandler } = require("../utils/helper");
const AppError = require("../utils/ApiError");
const { indiaStates, upDistricts } = require("../utils/indian_states")
const Candidate = require("../models/cadidate")
const Gallery = require("../models/gallery.model")

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
        event.description = description.toString().trim();

        // Normalize and validate type
        type = type.toString().toLowerCase().trim();
        if (!EVENTS.includes(type)) {
            return next(new AppError("Invalid Type, Please send valid data", 400));
        }
        event.type = type;

        // Sanitize location fields
        // State
        const formattedState = state.toString().toLowerCase().trim();

        const validState = indiaStates.some(
            s => s.name === formattedState
        );

        if (!validState)
            return next(new AppError("Invalid state name", 400));

        event.state = formattedState;


        // District
        const formattedDistrict = district.toString().toLowerCase().trim();

        const validDistrict = upDistricts.some(
            d => d.name === formattedDistrict
        );

        if (!validDistrict)
            return next(new AppError("Invalid District", 400));

        event.district = formattedDistrict;

        // Village
        const villages = ['balua', 'belwa', "mahuawa"];

        const formattedVillage = village.toLowerCase().trim();

        if (!villages.includes(formattedVillage))
            return next(new AppError("Invalid village name", 400));

        event.village = formattedVillage;

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
        event.slug = `${title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")}-${Date.now()}`;

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

// Update Event
exports.updateEvent = async (req, res, next) => {
    try {
        // Extract data from request body
        let { title, description, type, state, district, village, startDate, endDate, instructions, eventId } = req.body;

        // Extract userId from auth middleware
        const { userId } = req.user;

        // Validate userId existence
        if (!userId)
            return next(new AppError("User ID not found", 404));


        // Event ID
        if (!eventId)
            return next(new AppError("Event ID is reqruied", 400))

        // Validate userId format (MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(userId))
            return next(new AppError("Invalid User ID", 400));

        // Event
        const event = await Event.findById(eventId);

        if (!event)
            return next(new AppError("Event not Found", 404));

        // Title
        if (title) {
            title = title.toString().toLowerCase().trim();
            event.title = title;
        }

        // Description
        if (description) {
            description = description.toString().trim();
            event.description = description;
        }

        // Type
        if (type) {
            const formatedType = type.toString().toLowerCase().trim();

            if (!EVENTS.includes(formatedType))
                return next(new AppError("Invalid Type", 400));

            event.type = formatedType
        }

        // State 
        if (state) {
            const formatedState = state.toString().toLowerCase().trim();

            const validState = indiaStates.some(
                s => s.name === formatedState
            );

            if (!validState)
                return next(new AppError("Invalid state name", 400));

            event.state = formatedState;
        }

        // District
        if (district) {
            const formattedDistrict = district.toString().toLowerCase().trim();

            const validDistrict = upDistricts.some(
                d => d.name === formattedDistrict
            );

            if (!validDistrict)
                return next(new AppError("Invalid District", 400));

            event.district = formattedDistrict;
        }

        // village
        const villages = ['balua', 'belwa', "mahuawa"];
        if (village) {
            const formattedVillage = village.toString().toLowerCase().trim();
            if (!villages.includes(formattedVillage))
                return next(new AppError("Invalid village name", 400));
            //save
            event.village = formattedVillage
        }

        // Instructions
        if (instructions) {
            const formatedIntructions = Array.isArray(instructions)
                ? instructions
                    .map(instruction => instruction.toString().toLowerCase().trim())
                    .filter(Boolean)
                : typeof instructions === "string"
                    ? instructions
                        .split(",")
                        .map(i => i.toLowerCase().trim())
                        .filter(Boolean)
                    : [];

            if (formatedIntructions.length === 0)
                return next(new AppError("Instructions are required", 400));

            event.instructions = formatedIntructions;
        }


        // Start Date & End Date
        if (startDate || endDate) {
            const newStartDate = startDate ? new Date(startDate) : event.startDate;
            const newEndDate = endDate ? new Date(endDate) : event.endDate;

            // Validate date format
            if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
                return next(new AppError("Invalid date format", 400));
            }

            // Logical check
            if (newStartDate > newEndDate) {
                return next(new AppError("Start date must be before end date", 400));
            }

            event.startDate = newStartDate;
            event.endDate = newEndDate;
        }

        // OwnerShip check
        if (event.createdBy.toString() !== userId)
            return next(new AppError("You are not allowed to update this event", 403));

        // nothing to update

        if (
            !title &&
            !description &&
            !type &&
            !state &&
            !district &&
            !village &&
            !startDate &&
            !endDate &&
            !instructions
        ) {
            return next(new AppError("Nothing to update.", 400))
        }

        // Save
        await event.save();

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event
        });
    } catch (err) {
        console.log("Error while updating Event", err);
        return next(err)
    }
}

// TODO - GET All Events
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

// TODO - GET Event BY Slug
exports.getEventBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        if (!slug)
            return next(new AppError("Slug is required", 400));

        const formattedSlug = slug.toLowerCase().trim();

        const event = await Event.findOne({
            slug: formattedSlug,
            isDeleted: false
        }).populate("candidates")
            .populate("gallery")
            .populate({
                path: "createdBy",
                select: "firstName lastName email"
            });

        if (!event)
            return next(new AppError("Event not found", 404));

        return res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });

    } catch (err) {
        console.log("Error While Getting Event By Slug", err);
        return next(err);
    }
};

// TODO - DELETE Event
exports.deleteEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.user;

        if (!eventId)
            return next(new AppError("Event ID is required", 400));

        const event = await Event.findById(eventId);

        if (!event)
            return next(new AppError("Event not found", 404));

        //  ownership check
        if (event.createdBy.toString() !== userId)
            return next(new AppError("You are not allowed to delete this event", 403));

        //  soft delete
        event.isDeleted = true;
        event.deletedAt = new Date();
        event.deletedBy = userId;

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });

    } catch (err) {
        console.log("Error while Deleting the Event", err);
        return next(err);
    }
};