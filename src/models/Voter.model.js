const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    voterID: {
        type: String,
        required: true
    },

    votedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("Voter", voterSchema);