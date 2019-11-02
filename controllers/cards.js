const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const Card = require("../models/Card");

// @desc    Get all cards
// @route   GET /api/v1/cards
// @access  Private/Admin
exports.getCards = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get card
// @route   GET /api/v1/cards/:id
// @access  Private/Card
exports.getCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findById(req.params.id).populate("cards");

  if (!card) {
    return next(
      new ErrorResponse(`Card not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: card
  });
});

// @desc    Create card
// @route   POST /api/v1/cards
// @access  Private/Admin
exports.createCard = asyncHandler(async (req, res, next) => {
  const card = await Card.create(req.body);

  res.status(201).json({ success: true, data: card });
});

// @desc    Update merchant
// @route   PUT /api/v1/cards/:id
// @access  Private/Admin
exports.updateCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: card });
});

// @desc    Delete card
// @route   DELETE /api/v1/cards/:id
// @access  Private/Admin
exports.deleteCard = asyncHandler(async (req, res, next) => {
  const card = await Card.findByIdAndDelete(req.params.id);

  if (!card) {
    return next(
      new ErrorResponse(`Card not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
