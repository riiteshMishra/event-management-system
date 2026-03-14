const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");


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
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    avatar: {
        type: String,
        default: ""
        // required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        // required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        trim: true,
    },
    phoneNumber: {
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
        type: String,
        required: true,
        trim: true,
        enum: ["super-admin", "admin", "gram-prdhan"]
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    language: {
        type: String,
        enum: ["en", "hi"],
        default: "en"
    },
    // Password reset
    resetPasswordToken: {
        type: String,
        trim: true
    },
    resetPasswordExpires: {
        type: Date
    }

}, { timestamps: true });


userSchema.pre("save", async function () {

    // password modified or not
    if (!this.isModified("password")) return;

    // hash password
    this.password = await bcrypt.hash(this.password, 10);
});


module.exports = mongoose.model("User", userSchema);