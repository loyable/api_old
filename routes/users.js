const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize("admin"));

// @route   GET /api/v1/users
router
  .route("/")
  .get(
    advancedResults(User, ["merchants.merchant", "merchants.cards.card"]),
    getUsers
  )
  .post(createUser);

// @route   GET /api/v1/users/:id
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
