require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // We'll create this next

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS

// Basic route for testing
app.get("/", (req, res) => {
  res.send("PDF Annotator Backend is Running!");
});
//ROute
app.use("/api/auth", require("./routes/authRoutes"));
// Define a port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
