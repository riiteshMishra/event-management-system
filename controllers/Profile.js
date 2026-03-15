const User = require("../models/user");
const AppError = require("../utils/apiError");
const fileUploader = require("../utils/fileUploader");
const { validateFile } = require("../utils/helper");

// Avatar Upload
exports.updateAvatar = async (req, res, next) => {
  try {

    // check req.files
    if (!req.files || !req.files.avatar) {
      return next(new AppError("Avatar file is required", 400));
    }

    const { avatar } = req.files;
    const { userId } = req.user;

    if (!validateFile(avatar.name)) { 
      return next(new AppError("Invalid file extension", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const maxSize = 2 * 1024 * 1024;

    if (avatar.size > maxSize) {
      return next(new AppError("Heavy file detected. Max size is 2MB", 400));
    }

    const uploadedAvatar = await fileUploader(avatar);

    if (!uploadedAvatar) {
      return next(new AppError("Avatar uploading failed, Please try again later", 500));
    }

    user.avatar = uploadedAvatar.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: user.avatar
    });

  } catch (err) {
    console.log("Error while updating profile image", err);
    return next(err);
  }
};

