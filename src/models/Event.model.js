const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        // unique: true,
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    type: {
        type: String,
        enum: ["election", "party", "meeting", "function", "festival"],
        required: [true, "Type is required"]
    },

    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        lowercase: true,
    },

    district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
        lowercase: true,
    },

    village: {
        type: String,
        required: [true, "Village is required"],
        trim: true,
        lowercase: true,
    },

    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },

    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },

    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate"
        }
    ],

    instructions: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ],

    thumbnail: {
        type: String,
        required: [true, "Thumbnail is required"],
        trim: true,
    },

    gallery: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery",
    }],

    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);