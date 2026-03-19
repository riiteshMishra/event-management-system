require("dotenv").config()
const mongoose = require("mongoose");
const validator = require("validator")
const crypto = require("crypto");
const bcrypt = require("bcrypt")
const User = require("../../models/user");
const { ROLES } = require("../../utils/helper");
const jwt = require("jsonwebtoken")
const AppError = require("../../utils/apiError");
const mailSender = require("../../utils/mailSender");

// Create Election
exports.createElection = async (req, res, next) => {
    try {

        const { electionDate, boothNumber, } = req.body;

        return res.status(201).json({
            success: true,
            message: "Election Created",
            // data:
        })
    } catch (err) {
        console.log("Error While Creating Election", err);
        return next(err)
    }
}