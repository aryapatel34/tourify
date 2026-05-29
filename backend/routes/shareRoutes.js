import express from 'express';
import Itinerary from '../models/Itinerary.js';

const router = express.Router();

// @desc    Get shared itinerary by token
// @route   GET /api/share/:shareToken
// @access  Public
router.get('/:shareToken', async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareToken: req.params.shareToken,
      isPublic: true
    });

    if (!itinerary) {
      res.status(404);
      return next(new Error('Public itinerary not found or is set to private'));
    }

    res.status(200).json({
      success: true,
      itinerary
    });
  } catch (error) {
    next(error);
  }
});

export default router;
