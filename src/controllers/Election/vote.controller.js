const Voter = require("../../models/Voter.model");
const AppError = require("../../utils/apiError");
const mongoose = require("mongoose");
const Event = require("../../models/Event.model");
const Candidate = require("../../models/cadidate");
const OTP = require("../../models/otp");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// Create vot (open route)
exports.createVote = async (req, res, next) => {
    try {

        const { candidateId } = req.params;
        let { eventId, email, otp } = req.body;

        // validate
        if (!eventId || !email || !otp || !candidateId)
            return next(new AppError("All required fields must be provided", 400));

        if (!mongoose.Types.ObjectId.isValid(candidateId))
            return next(new AppError("Invalid candidate ID format", 400));

        if (!mongoose.Types.ObjectId.isValid(eventId))
            return next(new AppError("Invalid event ID format", 400));

        // sanitize
        email = email.toString().toLowerCase().trim();
        otp = otp.toString().trim();

        // event check
        const event = await Event.findById(eventId);
        if (!event)
            return next(new AppError("Event not found", 404));

        // candidate check
        const candidate = await Candidate.findById(candidateId);
        if (!candidate)
            return next(new AppError("Candidate not found", 404));

        if (candidate.event.toString() !== eventId)
            return next(new AppError("Candidate does not belong to this event", 400));

        // OTP check
        const dbOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!dbOTP)
            return next(new AppError("OTP not found or expired", 400));

        const isMatch = await bcrypt.compare(otp, dbOTP.otp);

        if (!isMatch)
            return next(new AppError("Invalid OTP", 400));

        await OTP.findByIdAndDelete(dbOTP._id);

        // duplicate vote check
        const hash = crypto
            .createHash("sha256")
            .update(email + eventId)
            .digest("hex");

        const alreadyVoted = await Voter.findOne({
            event: eventId,
            voterIDHash: hash
        });

        if (alreadyVoted)
            return next(new AppError("You have already cast your vote for this event", 400));

        // save vote
        const voter = await Voter.create({
            event: eventId,
            voterIDHash: hash,
            candidate: candidateId,
        });

        candidate.voters.push(voter._id);
        await candidate.save();

        return res.status(201).json({
            success: true,
            message: "Vote submitted successfully"
        });

    } catch (err) {
        console.log("Error While creating vote", err);
        return next(new AppError("Something went wrong while processing your vote", 500));
    }
};


// TODO - result api
exports.getElectionResult = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return next(new AppError("Invalid event ID", 400));
        }


        // event check
        const event = await Event.findById(eventId);
        if (!event) {
            return next(new AppError("Event not found", 404));
        }

        if (new Date() < event.endDate) {
            return next(new AppError("Election is still ongoing", 400));
        }

        // aggregation
        const results = await Voter.aggregate([
            {
                $match: {
                    event: new mongoose.Types.ObjectId(eventId)
                }
            },
            {
                $group: {
                    _id: "$candidate",
                    votes: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate"
                }
            },
            {
                $unwind: "$candidate"
            },
            {
                $project: {
                    _id: 0,
                    candidateId: "$candidate._id",
                    name: "$candidate.fullName",
                    symbol: "$candidate.symbol",
                    votes: 1
                }
            },
            {
                $sort: { votes: -1 }
            }
        ])

        return res.status(200).json({
            success: true,
            message: "Election results fetched successfully",
            data: results

        });

    } catch (err) {
        console.log("Error while getting election result", err);
        return next(new AppError("Failed to fetch results", 500));
    }
};
