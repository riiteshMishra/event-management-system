const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSendTemplate = require("../templates/mail/otpSend");
const bcrypt = require("bcrypt")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes me document delete ho jayega
    }
}, { timestamps: true });



// HASH OTP BEFORE SAVE
otpSchema.pre("save", async function () {

    if (!this.isModified("otp"))
        return

    this.otp = await bcrypt.hash(this.otp, 10);
});


// SEND EMAIL AFTER SAVE


module.exports = mongoose.model("One_Time_Password", otpSchema);