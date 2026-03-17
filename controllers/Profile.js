const User = require("../models/user");
const AppError = require("../utils/apiError");
const fileUploader = require("../utils/fileUploader");
const { validateFile } = require("../utils/helper");
const Profile = require("../models/profile")
const Address = require("../models/address");
const { upDistricts, indiaStates } = require("../utils/indian_states");
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

    const updatedProfile = await Profile.findById(profile?._id).populate("address")

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (err) {
    console.log("Error while updating profile", err);
    return next(err);
  }
};


// address
exports.updateAddress = async (req, res, next) => {
  try {

    if (!req.body)
      return next(new AppError("req.body not found, please the valid req.body", 404))

    let { house, village, district, state, pincode, landmark } = req.body;
    const { userId } = req.user
    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found, Please login again", 404))

    // find Address
    const address = await Address.findOne({ userId })
    if (!address) return next(new AppError("Address not Found . connect with support", 404));

    // Village
    const allowedVillages = ["balua", "belwa", "mahuawa", "other"];

    if (village) {

      const formattedVillage = village.toString().toLowerCase().trim();

      if (!allowedVillages.includes(formattedVillage))
        return next(new AppError("Invalid Village name", 400))

      village = formattedVillage;
    }

    // district
    if (district) {

      const formattedDistrict = district.toString().toLowerCase().trim();

      const isValidDistrict = upDistricts.some(
        (d) => d.name === formattedDistrict
      );

      if (!isValidDistrict) {
        return next(
          new AppError(
            "Invalid district name, districts are allowed only from Uttar Pradesh",
            400
          )
        );
      }

      district = formattedDistrict;
    }


    // State
    if (state) {

      const formattedState = state.toString().toLowerCase().trim();

      const isValidState = indiaStates.some(
        (s) => s.name === formattedState
      );

      if (!isValidState) {
        return next(new AppError("Invalid State name", 400));
      }

      state = formattedState;
    }

    // 
    if (pincode && !/^[1-9][0-9]{5}$/.test(pincode)) {
      return next(new AppError("Invalid pincode", 400));
    }

    // Sanitization
    if (house) address.house = house.toString().trim();
    if (village) address.village = village;
    if (district) address.district = district;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode.toString().trim();
    if (landmark) address.landmark = landmark.toString().toLowerCase().trim();

    // save the address
    await address.save();
    const profile = await Profile.findById(user?.profile).populate("address")
    return res.status(200).json({
      success: true,
      message: "Address updated",
      data: profile || ""
    })
  } catch (err) {
    console.log("Error while updating address",);
    return next(err)
  }
}