const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const voterSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event is required"]
    },

    voterIDHash: {
        type: String,
        required: [true, "Voter is required"]
    },

    // Candidate
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: [true, "Candidate is required"]
    },

    votedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });



module.exports = mongoose.model("Voter", voterSchema);