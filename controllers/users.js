const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const Merchant = require("../models/Merchant");
const Card = require("../models/Card");

// @desc    Get all users
// @route   GET /api/v1/users || GET /api/v1/merchant/:merchant/users
// @access  Private/Admin || Private/Merchant
exports.getUsers = asyncHandler(async (req, res, next) => {
  if (req.params.merchant) {
    const users = await User.find({
      "merchants.merchant": req.params.merchant
    });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get user
// @route   GET /api/v1/users/:id || GET /api/v1/merchant/:merchant/users/:id
// @access  Private/User | Private/Merchant
exports.getUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  if (req.params.merchant) {
    const merchant = user.merchants.find(
      merchant => merchant.merchant.id === req.params.merchant
    );

    user.merchants = merchant;
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get all merchants from user
// @route   GET /api/v1/users/:id/merchants
// @access  Private/User
exports.getMerchantsFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  res.status(200).json({
    success: true,
    count: user.merchants.length,
    data: user.merchants
  });
});

// @desc    Get single merchant from user
// @route   GET /api/v1/users/:id/merchants/:merchant
// @access  Private/User
exports.getMerchantFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  res.status(200).json({ success: true, data: merchant });
});

// @desc    Add merchant to user
// @route   POST /api/v1/users/:id/merchants
// @access  Private/Merchant
exports.addMerchantToUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  // Check if merchants already exists
  let merchant = user.merchants.find(
    merchant => merchant.merchant.toString() === req.body.merchant
  );

  // If exists return error
  if (merchant) {
    return next(
      new ErrorResponse(
        `Merchant with id ${req.body.merchant} already exists in user with id ${req.params.id}`,
        400
      )
    );
  }

  // If not exists push req.body into the array
  user.merchants.push(req.body);

  // Save the user object
  await user.save();

  // Query the DB and populate
  user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  // Find in the merchants array the req.body.merchant and return the merchant inserted
  merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.body.merchant
  );

  res.status(200).json({ success: true, data: merchant });
});

// @desc    Update single merchant in user
// @route   PUT /api/v1/users/:id/merchants/:merchant
// @access  Private/Merchant
exports.updateMerchantInUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (req.body.merchant || req.body._id) {
    return next(new ErrorResponse("Merchant ID is not changeable", 400));
  }

  const merchants = user.merchants.map(merchant => {
    if (merchant.merchant.toString() === req.params.merchant) {
      return Object.assign(merchant, req.body);
    } else {
      return merchant;
    }
  });

  user.merchants = merchants;

  await user.save();

  // Query the DB and populate
  user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);
  // Find in the merchants array the req.body.merchant and return the merchant inserted
  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  res.status(200).json({ success: true, data: merchant });
});

// @desc    Delete single merchant from user
// @route   DELETE /api/v1/users/:id/merchants/:merchant
// @access  Private/Merchant
exports.deleteMerchantFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const merchants = user.merchants.filter(
    merchant => merchant.merchant.toString() !== req.params.merchant.toString()
  );

  user.merchants = merchants;

  await user.save();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get all merchant cards from user
// @route   GET /api/v1/users/:id/merchants/:merchant/cards
// @access  Private/User | Private/Merchant
exports.getMerchantCardsFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  res.status(200).json({
    success: true,
    count: merchant.cards.length,
    data: merchant.cards
  });
});

// @desc    Get single merchant card from user
// @route   GET /api/v1/users/:id/merchants/:merchant/cards/:card
// @access  Private/User | Private/Merchant
exports.getMerchantCardFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  const card = merchant.cards.find(card => card.id === req.params.card);

  res.status(200).json({ success: true, data: card });
});

// @desc    Create merchant card in user
// @route   POST /api/v1/users/:id/merchants/:merchant/cards
// @access  Private/Merchant
exports.createMerchantCardInUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  const merchants = user.merchants.map(merchant => {
    if (merchant.merchant.toString() === req.params.merchant) {
      merchant.cards.push(req.body);
    }
    return merchant;
  });

  user.merchants = merchants;

  await user.save();

  user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  user.merchants = merchant;

  res.status(200).json({ success: true, data: user });
});

// @desc    Update single merchant card from user
// @route   PUT /api/v1/users/:id/merchants/:merchant/cards/:card
// @access  Private/Merchant
exports.updateMerchantCardInUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  const merchants = user.merchants.map(merchant => {
    if (merchant.merchant.toString() === req.params.merchant) {
      card = merchant.cards.map(card => {
        if (card._id.toString() === req.params.card) {
          card = Object.assign(card, req.body);
        }
        return card;
      });
    }
    return merchant;
  });

  user.merchants = merchants;

  await user.save();

  user = await User.findById(req.params.id).populate([
    "merchants.merchant",
    "merchants.cards.card"
  ]);

  const merchant = user.merchants.find(
    merchant => merchant.merchant.id === req.params.merchant
  );

  user.merchants = merchant;

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete single merchant card from user
// @route   DELETE /api/v1/users/:id/merchants/:merchant/cards/:card
// @access  Private/Merchant
exports.deleteMerchantCardInUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const merchants = user.merchants.map(merchant => {
    if (merchant.merchant.toString() === req.params.merchant) {
      merchant.cards = merchant.cards.filter(card => {
        return card._id.toString() !== req.params.card;
      });
    }
    return merchant;
  });

  user.merchants = merchants;

  await user.save();

  res.status(200).json({ success: true, data: {} });
});
