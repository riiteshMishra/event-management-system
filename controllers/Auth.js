const { errorHandler } = require("../middlewares/errorHandler");
const validator = require("validator")
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const OTP = require("../models/otp")
const User = require("../models/user");
const { ROLES } = require("../utils/helper");
const Profile = require("../models/profile")

// SEND OTP
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

// SIGN UP
exports.signUp = async (req, res, next) => {
  try {
    let { firstName, lastName, role, email, password, confirmPassword, phoneNumber, otp } = req.body

    // VALIDATION
    if (
      !firstName ||
      !lastName ||
      !role ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber || !otp
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }


    // SANITIZATION
    firstName = firstName.toString().toLowerCase().trim();
    lastName = lastName.toString().toLowerCase().trim();
    email = email.toString().toLowerCase().trim()
    role = role.toString().trim()
    phoneNumber = phoneNumber.toString().trim()
    otp = otp.toString().trim()

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      const error = new Error("Password & ConfirmPassword are not matched")
      error.statusCode = 400;
      return next(error)
    }

    // VALIDATE EMAIL 
    if (!validator.isEmail(email)) {
      const err = new Error("Invalid email");
      err.statusCode = 400;
      return next(err);
    }

    // check user aleardy exist
    const existedUser = await User.findOne({ email })
    if (existedUser) {
      const err = new Error("User already exist please login with this email");
      err.statusCode = 400;
      return next(err)
    }

    // OTP Match
    const dbOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!dbOtp) {
      const err = new Error("OTP expired or not found");
      err.statusCode = 404;
      return next(err);
    }

    if (dbOtp.otp !== otp) {
      const err = new Error("Invalid OTP");
      err.statusCode = 400;
      return next(err);
    }

    const OTP_EXPIRY = 5 * 60 * 1000;

    if (Date.now() - dbOtp.createdAt > OTP_EXPIRY) {
      const err = new Error("OTP expired");
      err.statusCode = 400;
      return next(err);
    }
    // OTP matched next step

    if (!ROLES.includes(role)) {
      const err = new Error("Invalid Role");
      err.statusCode = 400;
      return next(err);
    }

    // avatar
    const image = `https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`

    // Create Profile
    const profile = new Profile({
      gender: null,
      dateOfBirth: null,
      coverImage: null,
      bio: null,
      address: {
        village: null,
        district: null,
        state: null,
        pincode: null
      }
    });

    // Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      phoneNumber,
      password,
      profile: profile._id,
      avatar: image,
    })

    // save user id in profile
    profile.userId = user?._id;
    await profile.save()


    // delete OTP so it can't be reused
    await OTP.deleteMany({ email })

    // RETURN response
    return res.status(201).json({
      success: true,
      message: 'signed up successfully',
      data: user
    })
  } catch (err) {
    console.log("Error while sign up", err)
    return next(err)
  }
}

// TODO LOGIN
exports.login = async (req, res, next) => {
  try {

    let { email, password, } = req.body;

    // sanitize -
    email = email.toString().toLowerCase().trim();
    password = password.toString().trim()


    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: req.body

    });
  } catch (err) {
    return errorHandler(err, res);
  }
};

// TODO CHANGE PASSWORD
// TODO FORGOT PASSWORD