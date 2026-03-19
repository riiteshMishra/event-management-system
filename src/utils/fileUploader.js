const cloudinary = require("cloudinary").v2;

const fileUploader = async (file, quality) => {
    try {

        const options = {
            folder:  process.env.FOLDER_NAME,
            resource_type: "auto"
        };

        if (quality) options.quality = quality;

        const upload = await cloudinary.uploader.upload(
            file.tempFilePath,
            options
        );

        return upload;

    } catch (err) {
        console.log("Cloudinary upload error:", err);
    }
};

module.exports = fileUploader;