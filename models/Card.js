const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.ObjectId,
    ref: "Merchant"
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"]
  },
  description: String,
  header: {
    logo: {
      src: {
        type: String,
        default: "no-logo.png"
      },
      width: Number,
      height: Number,
      position: {
        type: String,
        enum: ["center", "left"]
      },
      verticalPosition: {
        type: String,
        enum: ["top", "center", "bottom"],
        default: "top"
      },
      marginBottom: Number,
      marginLeft: Number
    },
    text1: {
      value: String,
      color: String,
      fontSize: String,
      textAlign: String,
      fontStyle: String,
      fontWeight: String,
      lineHeight: Number,
      letterSpacing: Number
    },
    text2: {
      value: String,
      color: String,
      fontSize: String,
      textAlign: String,
      fontStyle: String,
      fontWeight: String,
      lineHeight: Number,
      letterSpacing: Number
    }
  },
  footer: {
    value: String,
    color: String,
    fontSize: String,
    textAlign: String,
    fontStyle: String,
    fontWeight: String,
    lineHeight: Number,
    letterSpacing: Number
  },
  design: {
    type: String,
    required: [true, "Please add card.design"],
    enum: ["horizontal", "vertical"],
    default: "horizontal"
  },
  marks: {
    total: {
      type: Number,
      min: 1,
      required: [true, "Please add marks.total number"]
    },
    rows: {
      type: Number,
      min: 1,
      default: 1,
      required: [true, "Please add marks.rows number"]
    },
    rowSpacing: Number,
    mark: {
      image: {
        src: {
          type: String,
          default: "no-marker.png"
        },
        width: Number,
        height: Number
      },
      style: {
        backgroundColor: {
          type: String,
          default: "#000000"
        },
        shape: {
          type: {
            type: String,
            enum: ["circle", "round"],
            default: "round"
          },
          value: {
            type: Number,
            default: 0
          }
        },
        justifyContent: String,
        borderWidth: Number,
        borderColor: String
      }
    }
  },
  style: {
    height: {
      type: Number,
      min: 0,
      required: [true, "Please add style.height"]
    },
    padding: Number,
    backgroundColor: String,
    borderRadius: Number,
    borderWidth: Number,
    borderColor: Number
  }
});

module.exports = mongoose.model("Card", CardSchema);
