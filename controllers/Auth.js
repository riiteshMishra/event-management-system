const { errorHandler } = require("../middlewares/errorHandler");
const validator = require("validator")
const crypto = require("crypto");
const OTP = require("../models/otp")

exports.sendOTP = async (req, res, next) => {
  try {

    let { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
        input: email
      });
    }

    // Sanitization
    email = email.trim().toLowerCase();

    const randOTP = crypto.randomInt(100000, 999999).toString();

    // check existing otp
    const alreadyOTP = await OTP.findOne({ email });

    if (alreadyOTP) {
      return res.status(429).json({
        success: false,
        message: "OTP already sent. Please wait."
      });
    }

    const data = await OTP.create({
      email,
      otp: randOTP
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      data: data.otp
    });

  } catch (err) {
    console.log("Error While Sending Email", err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { userCard } = req.body;

    if (!userCard) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userCard,

    });
  } catch (err) {
    return errorHandler(err, res);
  }
};
