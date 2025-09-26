const Pdf = require("../models/Pdf");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // For manual UUID if multer filename strategy changes
const pdfParse = require("pdf-parse"); // For future AI integrations

// Ensure uploads directory exists (redundant with multer config, but good for safety)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload a PDF file
// @route   POST /api/pdfs/upload
// @access  Private
const uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No PDF file uploaded." });
  }

  try {
    // Generate a UUID for the PDF
    const fileUuid = uuidv4();
    // Construct the final filename on the server using the UUID
    const newFileName = `${fileUuid}${path.extname(req.file.originalname)}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Rename the file that Multer temporarily saved to our UUID-based filename
    fs.renameSync(req.file.path, newFilePath);

    const pdf = await Pdf.create({
      user: req.user.id, // User ID from auth middleware
      originalName: req.file.originalname,
      fileName: newFileName, // Store the UUID-based filename
      uuid: fileUuid, // Store the UUID
    });

    // Optional: Trigger AI text extraction and embedding generation here
    // For now, just a placeholder. This will be integrated in AI phase.
    // You might want to run this in a background job for large PDFs.
    // const dataBuffer = fs.readFileSync(newFilePath);
    // const data = await pdfParse(dataBuffer);
    // console.log('Extracted text length:', data.text.length);
    // await embeddingService.chunkPdfForEmbeddings(pdf._id, data.text);
    // pdf.embeddingsGenerated = true;
    // await pdf.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdf: {
        _id: pdf._id,
        originalName: pdf.originalName,
        uuid: pdf.uuid,
        uploadDate: pdf.uploadDate,
      },
    });
  } catch (error) {
    console.error("Error during PDF upload:", error);
    // Clean up the uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Server error during PDF upload." });
  }
};

// @desc    Get all PDFs for the logged-in user
// @route   GET /api/pdfs
// @access  Private
const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find({ user: req.user.id }).sort({ uploadDate: -1 });
    res.status(200).json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Server error fetching PDFs." });
  }
};

// @desc    Get a single PDF metadata by its UUID
// @route   GET /api/pdfs/:uuid
// @access  Private
const getPdfByUuid = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found." });
    }
    res.status(200).json(pdf);
  } catch (error) {
    console.error("Error fetching PDF by UUID:", error);
    res.status(500).json({ message: "Server error fetching PDF." });
  }
};

// @desc    Download a PDF file by its UUID
// @route   GET /api/pdfs/download/:uuid
// @access  Private
const downloadPdf = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid, user: req.user.id });

    if (!pdf) {
      return res
        .status(404)
        .json({ message: "PDF not found or not authorized." });
    }

    const filePath = path.join(uploadDir, pdf.fileName);

    if (fs.existsSync(filePath)) {
      // Set appropriate headers for file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${pdf.originalName}"`
      ); // 'inline' to view in browser, 'attachment' to force download
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ message: "PDF file not found on server." });
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).json({ message: "Server error downloading PDF." });
  }
};

// @desc    Delete a PDF file
// @route   DELETE /api/pdfs/:uuid
// @access  Private
const deletePdf = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found." });
    }

    // Delete file from file system
    const filePath = path.join(uploadDir, pdf.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await pdf.deleteOne(); // Use deleteOne() on the document itself

    res.status(200).json({ message: "PDF deleted successfully." });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ message: "Server error deleting PDF." });
  }
};

// @desc    Rename a PDF file
// @route   PUT /api/pdfs/:uuid/rename
// @access  Private
const renamePdf = async (req, res) => {
  const { newName } = req.body; // Expecting newName without extension
  if (!newName) {
    return res.status(400).json({ message: "New name is required." });
  }

  try {
    const pdf = await Pdf.findOne({ uuid: req.params.uuid, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found." });
    }

    // Update originalName in DB
    pdf.originalName = newName + path.extname(pdf.originalName); // Preserve original extension
    await pdf.save();

    res.status(200).json({ message: "PDF renamed successfully.", pdf });
  } catch (error) {
    console.error("Error renaming PDF:", error);
    res.status(500).json({ message: "Server error renaming PDF." });
  }
};

module.exports = {
  uploadPdf,
  getAllPdfs,
  getPdfByUuid,
  deletePdf,
  renamePdf,
  downloadPdf,
};
