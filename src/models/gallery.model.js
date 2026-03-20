const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        mediaUrl: {
            type: String,
            required: true,
            trim: true,
        },

        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },

        caption: {
            type: String,
            trim: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        order: {
            type: Number,
            default: 0, // for sorting
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Gallery", gallerySchema);