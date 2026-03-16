const User = require("../models/user");
const AppError = require("../utils/apiError");
const fileUploader = require("../utils/fileUploader");
const { validateFile } = require("../utils/helper");
const Profile = require("../models/profile")

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


// Update Profile
exports.updateProfile = async (req, res, next) => {
  try {

    let { firstName, lastName, gender, dateOfBirth, bio, website, skills, socialLinks } = req.body;
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    const profile = await Profile.findById(user.profile);
    if (!profile) return next(new AppError("Profile not found.", 404));

    let coverImage;
    if (req.files && req.files.coverImage) {
      coverImage = req.files.coverImage;
    }

    // Sanitization
    if (firstName) user.firstName = firstName.toLowerCase().trim();
    if (lastName) user.lastName = lastName.toLowerCase().trim();
    if (gender) gender = gender.toLowerCase().trim();
    if (bio) bio = bio.trim();
    if (website) website = website.trim();

    // skills
    if (skills) {
      profile.skills = (Array.isArray(skills) ? skills : skills.split(","))
        .map(skill => skill.trim())
        .filter(Boolean);
    }

    // social links
    if (socialLinks) {
      profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    }

    // cover image upload
    if (coverImage) {
      const uploaded = await fileUploader(coverImage, 90);
      profile.coverImage = uploaded?.secure_url;
    }

    if (gender) profile.gender = gender;

    // date of birth
    if (dateOfBirth) {
      const parts = dateOfBirth.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        profile.dateOfBirth = new Date(`${year}-${month}-${day}`);
      }
    }
    // bio and website
    if (bio) profile.bio = bio;
    if (website) profile.website = website;
  
    await user.save();
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });

  } catch (err) {
    console.log("Error while updating profile", err);
    return next(err);
  }
};


// address
exports.updateAddress = async (req, res, next) => {
  try {
    let { house, village, district, state, pincode, landmark } = req.body;
  } catch (err) {
    console.log("Error while updating address",);
    return next(err)
  }
}