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

router.use(protect);
// router.use(authorize("admin"));

// @route  /api/v1/users
router
  .route("/")
  .get(
    authorize("merchant", "admin"),
    advancedResults(User, ["merchants.merchant", "merchants.cards.card"]),
    getUsers
  )
  .post(authorize("admin"), createUser);

// @route  /api/v1/users/:id
router
  .route("/:id")
  .get(getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

// @route  /api/v1/users/:id/merchants
router
  .route("/:id/merchants")
  .get(authorize("admin"), getMerchantsFromUser)
  .post(authorize("merchant", "admin"), addMerchantToUser);

// @route  /api/v1/users/:id/merchants/:merchant
router
  .route("/:id/merchants/:merchant")
  .get(authorize("merchant", "admin"), getMerchantFromUser)
  .put(authorize("merchant", "admin"), updateMerchantInUser)
  .delete(authorize("admin"), deleteMerchantFromUser);

// @route  /api/v1/users/:id/merchants/:merchant/cards
router
  .route("/:id/merchants/:merchant/cards")
  .get(authorize("merchant", "admin"), getMerchantCardsFromUser)
  .post(authorize("merchant", "admin"), createMerchantCardInUser);

// @route  /api/v1/users/:id/merchants/:merchant/cards/:card
router
  .route("/:id/merchants/:merchant/cards/:card")
  .get(authorize("merchant", "admin"), getMerchantCardFromUser)
  .put(authorize("merchant", "admin"), updateMerchantCardInUser)
  .delete(authorize("admin"), deleteMerchantCardInUser);

module.exports = router;
