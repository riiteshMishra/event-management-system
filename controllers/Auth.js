const { errorHandler } = require("../middlewares/errorHandler");

exports.createLoginToken = async (req, res, next) => {
  try {

  } catch (err) {
    return next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { userCard } = req.body;

    if (!userCard) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: userCard,

    });
  } catch (err) {
    return errorHandler(err, res);
  }
};
