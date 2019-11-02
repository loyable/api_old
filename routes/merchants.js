const express = require("express");

const {
  getMerchants,
  getMerchant,
  createMerchant,
  updateMerchant,
  deleteMerchant
} = require("../controllers/merchants");

const Merchant = require("../models/Merchant");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

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
