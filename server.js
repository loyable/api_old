const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route files
const users = require("./routes/users");
const merchants = require("./routes/merchants");
const cards = require("./routes/cards");
const auth = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
});

app.use(limiter);

// Prevent HTTP param pollution attacks
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Index page
app.get("/api/v1", (req, res) => {
  res.json({
    version: process.env.APP_VERSION,
    store: {
      ios: process.env.STORE_IOS,
      android: process.env.STORE_ANDROID
    }
  });
});

// Mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/merchants", merchants);
app.use("/api/v1/cards", cards);
app.use("/api/v1/auth", auth);

// Error handler middleware
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handler unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
