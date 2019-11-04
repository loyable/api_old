const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMerchantsFromUser,
  getMerchantFromUser,
  addMerchantToUser,
  updateMerchantInUser,
  deleteMerchantFromUser,
  getMerchantCardsFromUser,
  getMerchantCardFromUser,
  createMerchantCardInUser,
  updateMerchantCardInUser,
  deleteMerchantCardInUser
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// @route  /api/v1/users
router
  .route("/")
  .get(
    advancedResults(User, ["merchants.merchant", "merchants.cards.card"]),
    getUsers
  )
  .post(createUser);

// @route  /api/v1/users/:id
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// @route  /api/v1/users/:id/merchants
router
  .route("/:id/merchants")
  .get(getMerchantsFromUser)
  .post(addMerchantToUser);

// @route  /api/v1/users/:id/merchants/:merchant
router
  .route("/:id/merchants/:merchant")
  .get(getMerchantFromUser)
  .put(updateMerchantInUser)
  .delete(deleteMerchantFromUser);

// @route  /api/v1/users/:id/merchants/:merchant/cards
router
  .route("/:id/merchants/:merchant/cards")
  .get(getMerchantCardsFromUser)
  .post(createMerchantCardInUser);

// @route  /api/v1/users/:id/merchants/:merchant/cards/:card
router
  .route("/:id/merchants/:merchant/cards/:card")
  .get(getMerchantCardFromUser)
  .put(updateMerchantCardInUser)
  .delete(deleteMerchantCardInUser);

module.exports = router;
