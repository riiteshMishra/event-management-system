const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudinaryConnect = () => {
    try {

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });

        console.log("Cloudinary connected successfully");

    } catch (err) {
        console.log("Error while connecting cloudinary", err);
    }
};

module.exports = cloudinaryConnect;