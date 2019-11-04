const express = require("express");

const {
  getMerchants,
  getMerchant,
  createMerchant,
  updateMerchant,
  deleteMerchant
} = require("../controllers/merchants");

// Include other resource routers
const usersRouter = require("./users");
const cardsRouter = require("./cards");

const Merchant = require("../models/Merchant");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource router
router.use("/:merchant/users", usersRouter);
router.use("/:merchant/cards", cardsRouter);

// router.use(protect);
// router.use(authorize("admin"));

// @route   GET /api/v1/merchants
router
  .route("/")
  .get(advancedResults(Merchant, "cards"), getMerchants)
  .post(createMerchant);

// @route   GET /api/v1/merchants/:id
router
  .route("/:id")
  .get(getMerchant)
  .put(updateMerchant)
  .delete(deleteMerchant);

module.exports = router;
