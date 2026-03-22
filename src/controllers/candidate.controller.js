const mongoose = require("mongoose");
const Candidate = require("../models/cadidate")
const AppError = require("../utils/apiError");
const { validateFile } = require("../utils/helper");
const fileUploader = require("../utils/fileUploader");
const Event = require("../models/Event.model")

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