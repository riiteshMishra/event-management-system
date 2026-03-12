// file validate
const Image = ["jpg", "jpeg", "png", "webp"];
const Video = ["mp4", "mov", "avi"];

const validateFile = (file) => {
    try {
        const fileExt = file.split(".").pop().toLowerCase();

        if (!Image.includes(fileExt) && !Video.includes(fileExt)) {
            return {
                success: false,
                message: "File not supported",
                error: `${fileExt} is not supported`
            };
        }

        return { success: true };

    } catch (err) {
        console.log("error", err);
    }
};


// DATE HANDLER
const dateHandler = (date = Date.now()) => {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};


// USER VALIDATOR
const ROLES = ["super-admin", "admin", "gram-pradhan"];



module.exports = {
    validateFile,
    dateHandler,
    ROLES,
};