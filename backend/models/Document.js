import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true, // Local path or Cloudinary URL
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String, // Raw extracted text from AI/parser
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
