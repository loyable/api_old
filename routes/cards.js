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

router.use(protect);

// @route   GET /api/v1/cards
router
  .route("/")
  .get(
    authorize("merchant", "admin"),
    advancedResults(Card, "merchant"),
    getCards
  )
  .post(authorize("merchant", "admin"), createCard);

// @route   GET /api/v1/cards/:id
router
  .route("/:id")
  .get(authorize("merchant", "admin"), getCard)
  .put(authorize("merchant", "admin"), updateCard)
  .delete(authorize("admin"), deleteCard);

module.exports = router;
