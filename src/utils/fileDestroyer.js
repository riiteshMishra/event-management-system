const cloudinary = require("cloudinary").v2;

// extract public_id from URL
const getPublicId = (url) => {
    const parts = url.split("/");
    const fileWithExt = parts.slice(-2).join("/"); // folder/file.png
    return fileWithExt.split(".")[0]; // remove extension
};

// destroy function
const fileDestroyer = async (url) => {
    try {
        const publicId = getPublicId(url);

        const result = await cloudinary.uploader.destroy(publicId);

        return result;

    } catch (err) {
        console.log("Cloudinary destroy error:", err);
    }
};

module.exports = fileDestroyer;