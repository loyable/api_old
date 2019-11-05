const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      select: false,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false
    },
    name: {
      type: String,
      required: [true, "Please add a merchant name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"]
    },
    description: {
      type: String,
      required: [true, "Please add a description"]
    },
    address: {
      type: String,
      required: [true, "Please add an address"]
    },
    logo: {
      src: {
        type: String,
        default: "no-logo.png"
      },
      width: Number,
      height: Number,
      backgroundColor: String
    },
    details: {
      phone: String,
      website: {
        type: String
        // match: [
        //   /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/gi,
        //   "Please enter a valid URL"
        // ]
      }
    },
    style: {
      name: {
        fontSize: Number,
        fontFamily: String,
        textAlign: String,
        color: String,
        fontStyle: String,
        fontWeight: String,
        lineHeight: Number,
        letterSpacing: Number
      },
      address: {
        fontSize: Number,
        fontFamily: String,
        textAlign: String,
        color: String,
        fontStyle: String,
        fontWeight: String,
        lineHeight: Number,
        letterSpacing: Number
      }
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Reverse populate with virtuals
MerchantSchema.virtual("cards", {
  ref: "Card",
  localField: "_id",
  foreignField: "merchant",
  justOne: false
});

// Encrypt password using bcrypt
MerchantSchema.pre("save", async function(next) {
  // if (!this.isModified("password")) {
  //   next();
  // }
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
MerchantSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: "merchant" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
MerchantSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Merchant", MerchantSchema);
