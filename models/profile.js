const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },

    dateOfBirth: {
        type: Date,
        default: null
    },

    // ADDRESS
    address: {
        village: {
            type: String,
            trim: true,
            lowercase: true,
        },
        district: {
            type: String,
            trim: true,
            lowercase: true,
        },
        state: {
            type: String,
            trim: true,
            lowercase: true,
        },
        pincode: {
            type: String,
            trim: true
        }
    },

    coverImage: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 300
    }

}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);