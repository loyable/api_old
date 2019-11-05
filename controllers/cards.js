const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const Card = require("../models/Card");

// @desc    Get all cards
// @route   GET /api/v1/cards || GET /api/v1/merchant/:merchant/cards
// @access  Private/Admin
exports.getCards = asyncHandler(async (req, res, next) => {
  if (req.role === "merchant") {
    const cards = await Card.find({
      merchant: req.params.merchant
    });
    return res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get card
// @route   GET /api/v1/cards/:id || GET /api/v1/merchant/:merchant/cards/:card
// @access  Private/Merchant
exports.getCard = asyncHandler(async (req, res, next) => {
  let card;

  if (req.params.merchant) {
    card = await Card.findOne({
      _id: req.params.id,
      merchant: req.params.merchant
    });
  } else {
    card = await Card.findById(req.params.id).populate("cards");
  }

  if (!card) {
    return next(
      new ErrorResponse(`Card not found with id ${req.params.id}`, 404)
    );
  }

  if (card.merchant.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse(
        `Not authorized to view card with id ${req.params.id}`,
        401
      )
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
  if (req.role === "merchant") {
    req.body.merchant = req.user._id.toString();
  }
  const card = await Card.create(req.body);

  res.status(201).json({ success: true, data: card });
});

// @desc    Update card
// @route   PUT /api/v1/cards/:id
// @access  Private/Admin
exports.updateCard = asyncHandler(async (req, res, next) => {
  let card = await Card.findById(req.params.id);

  if (!card) {
    return next(
      new ErrorResponse(`Card not found with id ${req.params.id}`, 404)
    );
  }

  if (req.role === "merchant") {
    if (card.merchant.toString() !== req.user._id.toString()) {
      return next(
        new ErrorResponse(
          `Not authorized to update card with id ${req.params.id}`,
          401
        )
      );
    }
  }

  card = await Card.findByIdAndUpdate(req.params.id, req.body, {
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
