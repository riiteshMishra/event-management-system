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
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isStrongPassword(v, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0
                })
            },
            message: "Password must contain upper, lower and number"
        }
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
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    candidate: {
        type: mongoose.Types.ObjectId,
        ref: "Candidate"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);