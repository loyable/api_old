const express = require("express");

const {
  getCards,
  getCard,
  createCard,
  updateCard,
  deleteCard
} = require("../controllers/cards");

const Card = require("../models/Card");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// @route   GET /api/v1/cards
router
  .route("/")
  .get(advancedResults(Card, "merchant"), getCards)
  .post(createCard);

// @route   GET /api/v1/cards/:id
router
  .route("/:id")
  .get(getCard)
  .put(updateCard)
  .delete(deleteCard);

module.exports = router;
