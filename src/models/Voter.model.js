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


// store hash for privacy
voterSchema.pre("save", async function (next) {

    // already hashed hai to skip karo
    if (!this.isModified("voterIDHash")) {
        return next();
    }

    // voter ko private krna 
    const hash = await bcrypt.hash(this.voterIDHash, 10);

    // save
    this.voterIDHash = hash;

    next();
});

module.exports = mongoose.model("Voter", voterSchema);