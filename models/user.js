const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    contact: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v, "en-IN");
            },
            message: "Please provide valid Indian phone number"
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);