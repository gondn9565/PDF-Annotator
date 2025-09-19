const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuid

const PdfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalName: {
    // The name the user uploaded the file with
    type: String,
    required: true,
  },
  fileName: {
    // The actual filename on the server's file system (e.g., pdf-1678912345.pdf)
    type: String,
    required: true,
  },
  uuid: {
    // A unique identifier for the PDF, used in URLs and for linking highlights
    type: String,
    default: uuidv4, // Automatically generate UUID
    unique: true,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  // For AI features, to track if embeddings have been generated
  embeddingsGenerated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Pdf", PdfSchema);
