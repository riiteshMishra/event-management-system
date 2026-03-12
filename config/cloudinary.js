const cloudinary = require("cloudinary").v2;

exports.cloudinary = cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: ""
})