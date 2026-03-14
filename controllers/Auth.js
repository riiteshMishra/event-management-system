const { errorHandler } = require("../middlewares/errorHandler");
const validator = require("validator")
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const OTP = require("../models/otp")
const User = require("../models/user");
const { ROLES } = require("../utils/helper");
const Profile = require("../models/profile")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cookie = require("cookie");
const ApiError = require("../utils/apiError");
const mailSender = require("../utils/mailSender");
const passwordChangedTemplate = require("../templates/mail/passwordChaned");
const resetPasswordTemplate = require("../templates/mail/reset-password");
const passwordResetSuccessTemplate = require("../templates/mail/passwordResetSuccessTemplate");




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
    const alreadyOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (alreadyOTP && Date.now() - alreadyOTP.createdAt < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP"
      })
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

// TODO LOGIN 14/03/2026 done
exports.login = async (req, res, next) => {
  try {

    let { email, password, } = req.body;

    // checks
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    // sanitize -
    email = email.toString().toLowerCase().trim();
    password = password.toString().trim()

    // user dhundo
    const userData = await User.findOne({ email }).select("+password");


    // ab password match kro
    if (!userData || !(await bcrypt.compare(password, userData.password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      return next(error);
    }

    // ACTIVITY CHECK
    if (userData?.isActive !== true) {
      const err = new Error("Your account has been suspended.")
      err.statusCode = 400;
      return next(err)
    }

    // password match next step jwt create kro 

    const payload = { userId: userData?._id, role: userData?.role, email }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    }); // token ko client ko do or cache me store kro 

    // cookie set
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });


    userData.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (err) {
    return next(err);
  }
};

// TODO CHANGE PASSWORD 14/03/2026
exports.changePassword = async (req, res, next) => {
  try {

    // Get value from client
    let { oldPassword, password, confirmPassword } = req.body;
    const { userId } = req.user;

    // validation
    if (!oldPassword || !password || !confirmPassword) {
      return next(new ApiError("All fields are required", 400));
    }

    // Sanitization
    oldPassword = oldPassword.toString().trim();
    password = password.toString().trim();
    confirmPassword = confirmPassword.toString().trim();

    // new passwor match
    if (password !== confirmPassword) {
      return next(new ApiError("Password and confirm password didn't match", 400));
    }

    // find user
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return next(new ApiError("User not found, please login again", 404));
    }

    // compare password with dbpassword
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return next(new ApiError("Old password is incorrect", 400));
    }

    // same password ?
    if (await bcrypt.compare(password, user.password)) {
      return next(new ApiError("New password must be different from old password", 400))
    }

    // set new password
    user.password = password;

    // save user 
    await user.save();


    // clear old cookies 
    res.clearCookie("token");

    // payload
    const payload = {
      userId: user?._id,
      role: user?.role
    }

    const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // send email
    const userName = `${user.firstName} ${user.lastName}`;

    try {
      await mailSender(
        user.email,
        "Password Changed",
        passwordChangedTemplate(userName)
      );
    } catch (err) {
      console.log("Error while sending mail", err)
    }


    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      token: newToken,
    });

  } catch (err) {
    console.log("Error while changing password", err);
    return next(err);
  }
};


// CRAETE FORGOT PASSWORD TOKEN
exports.generateResetPasswordToken = async (req, res, next) => {
  try {

    // get email from client
    let { email } = req.body;

    // validation
    if (!email) {
      return next(new ApiError("Email is required", 400));
    }

    // sanitization
    email = email.toString().trim().toLowerCase();

    // check user
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError("User not found. Please sign up first.", 404));
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token before storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // save token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    await user.save();

    // send reset email
    const userName = `${user.firstName} ${user.lastName}`;

    await mailSender(
      user.email,
      "Reset Your Password",
      resetPasswordTemplate(userName, resetToken)
    );

    // response
    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
      resetToken
    });

  } catch (err) {
    console.error("Error while generating reset password token:", err.message);
    return next(err);
  }
};

// TODO RESET PASSWORD USING TOKEN
exports.forgotPassword = async (req, res, next) => {
  try {

    const { token } = req.params;
    let { password, confirmPassword } = req.body;

    // validation
    if (!token) {
      return next(new ApiError("Reset token is missing", 400));
    }

    if (!password || !confirmPassword) {
      return next(new ApiError("All fields are required", 400));
    }

    // sanitization
    password = password.toString().trim();
    confirmPassword = confirmPassword.toString().trim();

    // password match
    if (password !== confirmPassword) {
      return next(new ApiError("Password and Confirm Password must be same", 400));
    }

    // convert token to hashed token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user with valid token and expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
      return next(new ApiError("Invalid or expired reset token", 400));
    }

    // update password
    user.password = password;

    // remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // send success email
    const userName = `${user.firstName} ${user.lastName}`;

    try {
      await mailSender(
        user.email,
        "Password Changed Successfully",
        passwordResetSuccessTemplate(userName)
      );
    } catch (err) {
      console.log("Error while sending mail:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });

  } catch (err) {
    console.error("Error while resetting password:", err);
    return next(err);
  }
};