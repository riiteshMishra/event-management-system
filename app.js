const express = require("express");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
require("dotenv").config()
const cookieParser = require("cookie-parser")

const dns = require("dns");
dns.setServers([
  "8.8.8.8",   // Google primary
  "8.8.4.4",   // Google secondary
  "1.1.1.1",   // Cloudflare primary
  "1.0.0.1"    // Cloudflare fallback
]);

// console.log("DNS Servers:", dns.getServers());


const { errorHandler } = require("./src/middlewares/errorHandler");
const authRoute = require("./src/routes/authRoute");
const profileRoute = require("./src/routes/profile");
const eventRoute = require("./src/routes/event.route")
const limiter = require("./src/middlewares/rateLimiter");

const hpp = require("hpp");
const cors = require("cors");
const connectdb = require("./src/config/database")
const cloudinaryConnect = require("./src/config/cloudinary");

const app = express();
connectdb()
cloudinaryConnect()
// Body parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

app.use(hpp());

app.use(cors({
  origin: "http://localhost:4000",
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
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/event", eventRoute)

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