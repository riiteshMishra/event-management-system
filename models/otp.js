const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpSendTemplate = require("../templates/mail/otpSend");

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


// email send after OTP saved
otpSchema.post("save", async function (doc, next) {
    try {
        // console.log("OTP saved, sending email to:", doc.email);

        await mailSender(
            doc.email,
            "OTP Verification",
            otpSendTemplate(doc.otp, doc.email)
        );

        next();

    } catch (err) {
        console.log("Error while sending OTP email", err);
        next(err);
    }
});

module.exports = mongoose.model("One_Time_Password", otpSchema);