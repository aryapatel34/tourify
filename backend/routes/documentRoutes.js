import express from 'express';
import { uploadDocument, getDocument } from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadDocument);
router.route('/:id').get(protect, getDocument);

export default router;
