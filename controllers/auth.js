const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const SMSClient = require("../utils/sms");
const User = require("../models/User");
const Merchant = require("../models/Merchant");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  // Validate phone
  if (!phone) {
    return next(new ErrorResponse("Please provide a phone number", 400));
  }

  // Instantiate SMS class
  const SMS = new SMSClient(phone);

  // Check for user
  let user = await User.findOne({ phone });

  // If user not registered create user
  if (!user) {
    user = await User.create({
      phone,
      smsToken: SMS.generateHash(),
      smsExpire: Date.now() + process.env.SMS_TOKEN_EXPIRATION * 60 * 1000
    });
  } else {
    // If user is registered and token is not expired
    if (!SMS.expired(user.smsExpire)) {
      return next(
        new ErrorResponse("SMS code is not expired please call /login", 400)
      );
    }

    // Assign encrypted token & expire date to user
    user.smsToken = SMS.generateHash();
    user.smsExpire = Date.now() + process.env.SMS_TOKEN_EXPIRATION * 60 * 1000;

    // Save user
    await user.save();
  }

  // Disable SMS under development environment
  if (process.env.NODE_ENV !== "development") {
    await SMS.send();
  }

  res.status(200).json({
    success: true,
    data: {
      phone: user.phone,
      smsExpire: user.smsExpire
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { phone, smsCode, email, password } = req.body;

  // User login
  if (phone || smsCode) {
    // Validate phone
    if (!phone) {
      return next(new ErrorResponse("Please provide a phone number", 400));
    }

    // Validate smsCode
    if (!smsCode) {
      return next(new ErrorResponse("Please provide the SMS code", 400));
    }

    // Instantiate SMS class
    const SMS = new SMSClient(phone);

    // Check for user
    const user = await User.findOne({ phone });

    // If user not registered
    if (!user) {
      return next(new ErrorResponse("User not registered", 404));
    }

    if (SMS.expired(user.smsExpire)) {
      user.resetSMSToken({ logged: false });

      return next(
        new ErrorResponse(
          "SMS token is expired, please call /register again",
          401
        )
      );
    }

    if (!SMS.verifyHash(smsCode, user.smsToken)) {
      return next(
        new ErrorResponse("SMS code is invalid, please try again", 401)
      );
    }

    sendTokenResponse(user, 200, res);

    user.resetSMSToken({ logged: true });
    // Merchant login
  } else if (email || password) {
    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide and email and a password", 400)
      );
    }

    // Check for merchant
    const merchant = await Merchant.findOne({ email }).select("+password");

    if (!merchant) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await merchant.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(merchant, 200, res);
  }
});

// @desc    Update merchant password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const merchant = await Merchant.findOne({ email: req.body.email }).select(
    "+password"
  );

  // Check current password
  if (!(await merchant.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  merchant.password = req.body.newPassword;

  await merchant.save();

  sendTokenResponse(merchant, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (model, statusCode, res) => {
  // Create token
  const token = model.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    data: {
      id: model._id,
      token
    }
  });
};
