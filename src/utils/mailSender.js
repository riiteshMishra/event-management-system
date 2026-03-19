const nodemailer = require("nodemailer");

const mailSender = async (email, subject, html) => {
    try {

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE === "true",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"Gram Panchayat Balua" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: html
        });

        // console.log("Mail sent:", info);
        return info
    } catch (err) {
        console.log("Email send error:", err);
    }
};

module.exports = mailSender;