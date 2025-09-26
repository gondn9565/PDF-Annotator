const mongoose = require("mongoose");

const HighlightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pdf: {
    // Link to the Pdf document that this highlight belongs to
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pdf",
    required: true,
  },
  pageNumber: {
    // The page number where the highlight is
    type: Number,
    required: true,
  },
  text: {
    // The actual text that was highlighted
    type: String,
    required: true,
  },
  position: {
    // Store precise position data (e.g., bounding box coordinates or serialized range)
    type: Object, // This will depend on how your frontend captures highlight position
    required: true,
    // Example structure for position (can vary based on frontend library):
    // {
    //   rects: [{ x1, y1, x2, y2, width, height }],
    //   textNodes: [{ startOffset, endOffset, textContent }] // if using text ranges
    // }
  },
  comment: {
    // Optional: for user comments on highlights
    type: String,
    default: "",
  },
  // Fields for AI-powered features (from phase 4/5)
  aiSummary: {
    type: String,
    default: "",
  },
  keywords: [
    {
      // Array of keywords extracted from this highlight
      type: String,
    },
  ],
  voiceNote: {
    // Text from speech-to-text
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Highlight", HighlightSchema);
