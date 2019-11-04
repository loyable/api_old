const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    unique: true
    // match: [
    //   /^[+][0-9]{2}[0-9]{10}/g,
    //   "Please format the number as +393331234567"
    // ]
  },
  merchants: [
    {
      merchant: {
        type: mongoose.Schema.ObjectId,
        ref: "Merchant",
        required: true,
        unique: true
      },
      hidden: {
        type: Boolean
      },
      cards: [
        {
          card: {
            type: mongoose.Schema.ObjectId,
            ref: "Card",
            required: true
          },
          marked: {
            type: Number,
            min: 0,
            required: [true, "Please insert the number of markers"],
            default: 0
          },
          hidden: {
            type: Boolean
          },
          history: [
            {
              type: {
                type: String,
                enum: ["completed", "added", "add", "remove"]
              },
              value: {
                type: Number
              },
              time: {
                type: Date,
                default: Date.now
              }
            }
          ],
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  changeNumberToken: String,
  changeNumberExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model("User", UserSchema);
