import Itinerary from '../models/Itinerary.js';
import Document from '../models/Document.js';
import { generateItinerary } from '../services/extractionService.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Generate itinerary from document
// @route   POST /api/itinerary/generate/:documentId
// @access  Private
const createItinerary = async (req, res, next) => {
  try {
    const documentId = req.params.documentId;
    const document = await Document.findById(documentId);

    if (!document || document.user.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Document not found or unauthorized'));
    }

    if (document.status !== 'processed') {
      res.status(400);
      return next(new Error('Document is not yet processed or failed'));
    }

    // Check if itinerary already exists for this document
    const existingItinerary = await Itinerary.findOne({ document: documentId });
    if (existingItinerary) {
      return res.status(200).json({
        success: true,
        itinerary: existingItinerary,
        message: 'Itinerary already generated for this document'
      });
    }

    // Call AI to generate itinerary
    const generatedJSON = await generateItinerary(document.extractedText);

    // Save Itinerary
    const itinerary = await Itinerary.create({
      user: req.user._id,
      document: documentId,
      title: generatedJSON.title || 'My Trip',
      generatedContent: generatedJSON,
      shareToken: uuidv4(),
      isPublic: false
    });

    res.status(201).json({
      success: true,
      itinerary
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all user itineraries
// @route   GET /api/itinerary
// @access  Private
const getUserItineraries = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      itineraries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single itinerary details
// @route   GET /api/itinerary/:id
// @access  Private
const getItineraryById = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary || itinerary.user.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Itinerary not found or unauthorized'));
    }

    res.status(200).json({
      success: true,
      itinerary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itinerary/:id
// @access  Private
const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary || itinerary.user.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Itinerary not found or unauthorized'));
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle share status
// @route   PATCH /api/itinerary/:id/share
// @access  Private
const toggleShareItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary || itinerary.user.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Itinerary not found or unauthorized'));
    }

    itinerary.isPublic = !itinerary.isPublic;
    // ensure token exists
    if (!itinerary.shareToken) {
      itinerary.shareToken = uuidv4();
    }
    
    await itinerary.save();

    res.status(200).json({
      success: true,
      isPublic: itinerary.isPublic,
      shareToken: itinerary.shareToken
    });
  } catch (error) {
    next(error);
  }
};

export {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  deleteItinerary,
  toggleShareItinerary
};
