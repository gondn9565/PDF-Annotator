require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler"); // Import them here

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS

// Routes
app.get("/", (req, res) => {
  res.send("PDF Annotator Backend is Running!");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pdfs", require("./routes/pdfRoutes"));

// --------------------------------------------------------------------------
// !!! IMPORTANT: Error Handling Middleware MUST BE PLACED AFTER ALL ROUTES !!!
// --------------------------------------------------------------------------

// 1. Catch 404 errors (requests to non-existent routes)
// app.use(notFound);

// // 2. Centralized error handler
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
