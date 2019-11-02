const mongoose = require("mongoose");

const MerchantSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("Merchant", MerchantSchema);
