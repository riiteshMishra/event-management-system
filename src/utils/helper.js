// file validate
const Image = ["jpg", "jpeg", "png", "webp", "svg"];
const Video = ["mp4", "mov", "avi"];

const validateFile = (fileName) => {
    try {
        if (!fileName || typeof Name !== "string") {
            return {
                success: false,
                message: "Invalid file input"
            };
        }

        // remove query params if present
        const cleanFile = fileName.split("?")[0];

        const fileExt = cleanFile.split(".").pop().toLowerCase();

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
        return {
            success: false,
            message: "Something went wrong"
        };
    }
};

// DATE HANDLER
const dateHandler = (date = Date.now()) => {
    const d = new Date(date);

    if (isNaN(d.getTime())) return null; // invalid date

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


// USER VALIDATOR
const ROLES = ["super-admin", "admin", "gram-pradhan"];


// Event VAlidator
const EVENTS = ["election", "party", "meeting", "function", "festival"]


module.exports = {
    validateFile,
    dateHandler,
    ROLES,
    EVENTS,
};