const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const Card = require("../models/Card");

// @desc    Get all merchants
// @route   GET /api/v1/merchants
// @access  Private/Admin
exports.getMerchants = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get merchant
// @route   GET /api/v1/merchant/:id
// @access  Private/Merchant
exports.getMerchant = asyncHandler(async (req, res, next) => {
  if (req.role === "merchant") {
    if (req.params.id !== req.user._id.toString()) {
      return next(
        new ErrorResponse(
          `Not authorized to get merchant with id ${req.params.id}`,
          401
        )
      );
    }
  }
  const merchant = await Merchant.findById(req.params.id).populate("cards");

  if (!merchant) {
    return next(
      new ErrorResponse(`Merchant not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: merchant
  });
});

// @desc    Create merchant
// @route   POST /api/v1/merchants
// @access  Private/Admin
exports.createMerchant = asyncHandler(async (req, res, next) => {
  const merchant = await Merchant.create(req.body);

  res.status(201).json({ success: true, data: merchant });
});

// @desc    Update merchant
// @route   PUT /api/v1/merchants/:id
// @access  Private/Admin
exports.updateMerchant = asyncHandler(async (req, res, next) => {
  if (req.role === "merchant") {
    if (req.params.id !== req.user._id.toString()) {
      return next(
        new ErrorResponse(
          `Not authorized to update merchant with id ${req.params.id}`,
          401
        )
      );
    }
  }

  const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: merchant });
});

// @desc    Delete merchant
// @route   DELETE /api/v1/merchants/:id
// @access  Private/Admin
exports.deleteMerchant = asyncHandler(async (req, res, next) => {
  const merchant = await Merchant.findByIdAndDelete(req.params.id);

  if (!merchant) {
    return next(
      new ErrorResponse(`Merchant not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
