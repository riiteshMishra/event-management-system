const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    district: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    village: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ["upcoming", "active", "completed"],
        default: "upcoming"
    }
}, { timestamps: true })