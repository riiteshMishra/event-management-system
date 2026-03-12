const express = require("express");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
require("dotenv").config()

const dns = require("dns");

const { errorHandler } = require("./middlewares/errorHandler");
const authRoute = require("./routes/authRoute");
const limiter = require("./middlewares/rateLimiter");

const hpp = require("hpp");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const connectdb = require("./config/database");

const app = express();
connectdb()
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

app.use(hpp());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
}));

app.use(limiter());

// File upload
app.use(
  fileUpload({
    limits: { fileSize: 3 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1/auth", authRoute);

// Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;