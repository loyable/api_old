const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const User = require("./models/User");
const Merchant = require("./models/Merchant");
const Card = require("./models/Card");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const merchants = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/merchants.json`, "utf-8")
);
const cards = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/cards.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Merchant.create(merchants);
    await Card.create(cards);

    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Merchant.deleteMany();
    await Card.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

switch (process.argv[2]) {
  case "-i":
    importData();
    break;
  case "-d":
    deleteData();
    break;
}
