const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const ApiError = require("../utils/apiError");


// AUTHORIZATION
exports.auth = async (req, res, next) => {
    try {

        // find token
        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.headers.authorization?.split(" ").pop();

        if (!token) {
            return next(new ApiError("Authentication token is missing", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new ApiError("Invalid token. Please login again", 401));
        }

        req.user = decoded;
        next();

    } catch (err) {
        console.log("Auth Middleware Error:", err.message);
        return next(new ApiError("Authentication failed", 401));
    }
};



// SUPER ADMIN
exports.isSuperAdmin = async (req, res, next) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return next(new ApiError("User ID missing. Please login again", 401));
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        if (user.role !== "super-admin") {
            return next(new ApiError("Access denied. Super admin only route", 403));
        }

        next();

    } catch (err) {
        console.log("Super Admin Middleware Error:", err.message);
        return next(new ApiError("Error validating super admin", 500));
    }
};



// ADMIN
exports.isAdmin = async (req, res, next) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return next(new ApiError("User ID missing. Please login again", 401));
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        if (user.role !== "admin") {
            return next(new ApiError("Access denied. Admin only route", 403));
        }

        next();

    } catch (err) {
        console.log("Admin Middleware Error:", err.message);
        return next(new ApiError("Error validating admin", 500));
    }
};



// GRAM PRADHAN
exports.isGramPradhan = async (req, res, next) => {
    try {

        const userId = req.user?._id;

        if (!userId) {
            return next(new ApiError("User ID missing. Please login again", 401));
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(new ApiError("User not found", 404));
        }

        if (user.role !== "gram-prdhan") {
            return next(new ApiError("Access denied. Gram Pradhan only route", 403));
        }

        next();

    } catch (err) {
        console.log("Gram Pradhan Middleware Error:", err.message);
        return next(new ApiError("Error validating Gram Pradhan", 500));
    }
};