const mongoose = require("mongoose");
require("dotenv").config();

const connectdb = () => {
    mongoose.connect(process.env.MONGODB_URL)
        // .then(() => console.log("Database connected"))
        .catch((err) => {
            console.log("Database connection failed:", err);
            process.exit(1);
        });
};

module.exports = connectdb;