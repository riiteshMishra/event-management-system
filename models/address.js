const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile"
    },

    house: {
        type: String,
        trim: true
    },

    village: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["balua", "belwa", "mahuawa", "other"]
    },

    district: {
        type: String,
        trim: true,
        lowercase: true
    },

    state: {
        type: String,
        trim: true,
        lowercase: true
    },

    pincode: {
        type: String,
        trim: true,
        match: /^[0-9]{6}$/
    },

    landmark: {
        type: String,
        trim: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);