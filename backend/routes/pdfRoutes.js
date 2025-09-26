const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../config/multer"); // Multer config
const {
  uploadPdf,
  getAllPdfs,
  getPdfByUuid,
  deletePdf,
  renamePdf,
  downloadPdf, // We'll add this
} = require("../controllers/pdfController"); // We'll create this next

// Protect all PDF routes
router.use(protect);

// @route   POST /api/pdfs/upload
// @desc    Upload a PDF file
// @access  Private
router.post("/upload", upload.single("pdfFile"), uploadPdf); // 'pdfFile' is the field name from the form

// @route   GET /api/pdfs
// @desc    Get all PDFs for the logged-in user
// @access  Private
router.get("/", getAllPdfs);

// @route   GET /api/pdfs/:uuid
// @desc    Get a single PDF by its UUID (metadata)
// @access  Private
router.get("/:uuid", getPdfByUuid);

// @route   GET /api/pdfs/download/:uuid
// @desc    Download a PDF file by its UUID
// @access  Private
router.get("/download/:uuid", downloadPdf);

// @route   DELETE /api/pdfs/:uuid
// @desc    Delete a PDF file
// @access  Private
router.delete("/:uuid", deletePdf);

// @route   PUT /api/pdfs/:uuid/rename
// @desc    Rename a PDF file
// @access  Private
router.put("/:uuid/rename", renamePdf);

module.exports = router;
