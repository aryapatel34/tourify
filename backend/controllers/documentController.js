import Document from '../models/Document.js';
import path from 'path';
import { extractFromPDF, extractFromImage } from '../services/extractionService.js';

// @desc    Upload document and extract text
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('No file uploaded'));
    }

    const fileUrl = req.file.path; // Using local path
    const originalName = req.file.originalname;
    
    // Determine file type
    const ext = path.extname(originalName).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : 'image';

    // Save initial document state
    const document = await Document.create({
      user: req.user._id,
      fileUrl,
      fileType,
      originalName,
      status: 'pending'
    });

    // Process extraction in background or await (for simplicity awaiting here)
    let extractedText = '';
    
    try {
      if (fileType === 'pdf') {
        extractedText = await extractFromPDF(fileUrl);
      } else {
        extractedText = await extractFromImage(fileUrl, req.file.mimetype);
      }

      document.extractedText = extractedText;
      document.status = 'processed';
      await document.save();

      res.status(201).json({
        success: true,
        document,
      });

    } catch (err) {
      document.status = 'failed';
      await document.save();
      throw err;
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Document not found'));
    }

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadDocument, getDocument };
