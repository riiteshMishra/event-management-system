const mongoose = require("mongoose");
const Candidate = require("../models/cadidate")
const AppError = require("../utils/apiError");
const { validateFile } = require("../utils/helper");
const fileUploader = require("../utils/fileUploader");
const Event = require("../models/Event.model");
const fileDestroyer = require("../utils/fileDestroyer");
const cadidate = require("../models/cadidate");

// create Candidate (admins only)
exports.createCandidate = async (req, res, next) => {
    try {
        //  data fetch 
        let { fullName, promises, symbolName, message, slogan, contactNumber, email, socialLinks, eventId } = req.body;

        // file check
        const symbol = req.files?.symbol;

        // User check
        const { userId } = req.user

        if (!userId)
            return next(new AppError("User ID not found", 404));

        // check 
        if (!fullName || !symbolName || !contactNumber || !eventId)
            return next(new AppError("Some fields are mendatory", 400));

        // create candidate object
        const candidate = new Candidate({})

        // Sanitize && validate && push
        candidate.fullName = fullName.toString().toLowerCase().trim();
        candidate.symbolName = symbolName.toString().toLowerCase().trim();
        candidate.contactNumber = contactNumber.toString().trim();

        // SYMBOL
        if (symbol) {
            // validate file
            const validFile = validateFile(symbol.name);
            if (!validFile)
                return next(new AppError("Invalid file type", 400));

            // upload file
            const uploadedFile = await fileUploader(symbol);

            candidate.symbol = uploadedFile?.secure_url
        }


        // SLOGAN
        if (slogan)
            candidate.slogan = slogan.toString().toLowerCase().trim();

        // MESSAGE
        if (message) {
            candidate.message = Array.isArray(message)
                ? message.map(m => m.toString().toLowerCase().trim())
                : [message.toString().toLowerCase().trim()];
        }

        // Email 
        if (email)
            candidate.email = email.toString().toLowerCase().trim();

        // Promises && social links
        if (promises) {
            const formattedPromises = Array.isArray(promises)
                ? promises.map(p => p.toString().toLowerCase().trim()).filter(Boolean)
                : [promises.toString().toLowerCase().trim()];

            candidate.promises = formattedPromises;
        }

        //  social Links
        if (socialLinks) {
            const parsedLinks = typeof socialLinks === "string"
                ? JSON.parse(socialLinks)
                : socialLinks;

            candidate.socialLinks = {
                instagram: parsedLinks.instagram || "",
                facebook: parsedLinks.facebook || "",
                whatsapp: parsedLinks.whatsapp || ""
            };
        }

        // Existing
        const query = [
            { contactNumber: contactNumber.toString().trim() },
            { symbolName: symbolName.toString().toLowerCase().trim() }
        ];

        const existing = await Candidate.findOne({
            event: eventId,
            $or: query
        });

        if (existing)
            return next(new AppError("Candidate already exists or symbol taken", 400));

        // event
        const event = await Event.findById(eventId);
        if (!event)
            return next(new AppError("Event not found", 404));

        // save
        candidate.event = eventId;
        await candidate.save();

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            data: candidate
        })
    } catch (err) {
        console.log("Error while creating candidate", err);
        return next(err)
    }
}

// Update cadidate (admins only)
exports.updateCandidate = async (req, res, next) => {
    try {
        //  data fetch 
        let { fullName, promises, symbolName, message, slogan, contactNumber, email, socialLinks, eventId, candidateId } = req.body;

        // file check
        const symbol = req.files?.symbol;

        // User check
        const { userId } = req.user

        if (!userId)
            return next(new AppError("User ID not found", 404));

        // candidate
        if (!candidateId)
            return next(new AppError("Candidate ID is required", 400))

        const candidate = await Candidate.findById(candidateId);

        if (!candidate)
            return next(new AppError("Candidate Not found", 404));

        // Event
        if (eventId) {
            const event = await Event.findById(eventId);
            if (!event)
                return next(new AppError("Event not Found", 404));

            candidate.event = eventId;
        }

        // Validation && Asign

        // Full Name
        if (fullName)
            candidate.fullName = fullName.toString().toLowerCase().trim();

        // Symbol Name
        if (symbolName)
            candidate.symbolName = symbolName.toString().toLowerCase().trim();

        // Slogan
        if (slogan)
            candidate.slogan = slogan.toString().toLowerCase().trim();

        // Number
        if (contactNumber)
            candidate.contactNumber = contactNumber.toString().trim();

        // Email
        if (email)
            candidate.email = email.toString().toLowerCase().trim();

        // MESSAGE
        if (message) {
            let parsedMessage = message;

            if (typeof message === "string") {
                try {
                    parsedMessage = JSON.parse(message);
                } catch {
                    parsedMessage = [message];
                }
            }

            candidate.message = Array.isArray(parsedMessage)
                ? parsedMessage.map(m => m.toString().toLowerCase().trim()).filter(Boolean)
                : [parsedMessage.toString().toLowerCase().trim()];
        }


        // PROMISES
        if (promises) {
            let parsedPromises = promises;

            if (typeof promises === "string") {
                try {
                    parsedPromises = JSON.parse(promises);
                } catch {
                    parsedPromises = [promises];
                }
            }

            candidate.promises = Array.isArray(parsedPromises)
                ? parsedPromises.map(p => p.toString().toLowerCase().trim()).filter(Boolean)
                : [parsedPromises.toString().toLowerCase().trim()];
        }

        // Social links
        if (socialLinks) {
            let parsedLinks = {};

            try {
                parsedLinks = typeof socialLinks === "string"
                    ? JSON.parse(socialLinks)
                    : socialLinks;
            } catch {
                return next(new AppError("Invalid socialLinks format", 400));
            }

            // save
            candidate.socialLinks = parsedLinks
        }

        // file upload
        if (symbol) {
            const validFile = validateFile(symbol.name)

            if (!validFile)
                return next(new AppError("Invalid file type", 400));

            const uploadedFile = await fileUploader(symbol);

            if (!uploadedFile)
                return next(new AppError("File upload failed", 500));

            // save
            candidate.symbol = uploadedFile?.secure_url
        }


        // Duplecate Checks
        if (contactNumber || symbolName || email) {
            const query = [];

            if (contactNumber) query.push({ contactNumber });
            if (symbolName) query.push({ symbolName });
            if (email) query.push({ email });

            const existing = await Candidate.findOne({
                _id: { $ne: candidateId },
                event: candidate.event,
                $or: query
            });

            if (existing)
                return next(new AppError("Duplicate data found", 400));
        }

        // save and return
        await candidate.save()

        return res.status(200).json({
            success: true,
            message: "candidate updated successfully",
            data: candidate
        })
    } catch (err) {
        console.log("Error while updating the candidate", err);
        return next(err)
    }
}

// TODO - CANDIDATE DELETE
exports.deleteCandidate = async (req, res, next) => {
    try {
        const { candidateId } = req.params;

        if (!candidateId)
            return next(new AppError("candidate ID not found", 400));

        if (!mongoose.Types.ObjectId.isValid(candidateId))
            return next(new AppError("Invalid candidate ID", 400));

        // find candidate 
        const candidate = await Candidate.findById(candidateId);

        if (!candidate)
            return next(new AppError("Candidate Not Found", 404));

        // media delete
        const symbolUrl = candidate.symbol;

        if (symbolUrl && typeof symbolUrl === "string" && symbolUrl.includes("cloudinary"))
            await fileDestroyer(symbolUrl);

        // delete from DB
        await Candidate.findByIdAndDelete(candidateId);

        return res.status(200).json({
            success: true,
            message: "candidate deleted successfully"
        });

    } catch (err) {
        console.log("Error while deleting candidate", err);
        return next(err);
    }
};

// TODO - CADIDATE FETCH BY ID
exports.getCandidate = async (req, res, next) => {
    try {

        // CANDIDATE ID VALIDAITON 
        const { candidateId } = req.params;

        if (!candidateId)
            return next(new AppError("Candidate ID is required", 400));

        if (!mongoose.Types.ObjectId.isValid(candidateId))
            return next(new AppError("Invalid Candidate Id", 400));

        // find candidate
        const candidate = await Candidate.findById(candidateId).populate("event", "name date") // only required fields
            .populate({
                path: "voters",
                select: "_id",
                options: { limit: 10 } // optional
            })

        if (!candidate)
            return next(new AppError("Candidate not found"));


        return res.status(200).json({
            success: true,
            message: "candidate fetched successfully",
            data: candidate
        })

    } catch (err) {
        console.log("Error while fetching cadidate details", err);
        return next(err)
    }
}

// TODO - ALL CANDIDATE  FETCH
exports.getCandidates = async (req, res, next) => {
    try {
        // pagination
        const { page = 1, limit = 10 } = req.query;

        const candidates = await Candidate.find({})
            .select("fullName symbol symbolName event") // only required fields
            .populate("event", "title") // only event name
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean(); // performance boost

        return res.status(200).json({
            success: true,
            message: "all candidates fetched",
            data: candidates
        });

    } catch (err) {
        console.log("Error while Fetching all candidates", err);
        return next(err);
    }
};