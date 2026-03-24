const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({

    // Candidate Name
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    // Candidate promises to voters
    promises: [
        {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }
    ],

    // chunaw chinha (symbol)
    symbol: {
        type: String,
        default: "https://dummyimage.com/300x300/cccccc/000000&text=No+Image"
    },

    // Symbol name
    symbolName: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Symbol name is required"]
    },

    // message 
    message: [
        {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Message is required"]
        }
    ],

    // Event id (relation)
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event is required"]
    },

    // slogan (2 words type)
    slogan: {
        type: String,
        trim: true,
        lowercase: true,
    },

    // contact number
    contactNumber: {
        type: String,
        trim: true,
        unique: true
    },

    // email
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true
    },

    // Social links
    socialLinks: {
        instagram: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        },
        whatsapp: {
            type: String,
            trim: true
        }
    },

    // voters
    voters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voter"
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);