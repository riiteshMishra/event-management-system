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

  bio: {
    type: String,
    trim: true,
    maxlength: 300
  },

  coverImage: {
    type: String,
    default: ""
  },

  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address"
  },

  website: {
    type: String,
    trim: true
  },

  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  socialLinks: {
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },

  isPublic: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);