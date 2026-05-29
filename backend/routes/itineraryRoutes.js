import express from 'express';
import {
  createItinerary,
  getUserItineraries,
  getItineraryById,
  deleteItinerary,
  toggleShareItinerary
} from '../controllers/itineraryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserItineraries);

router.post('/generate/:documentId', protect, createItinerary);

router.route('/itinerary/:id')
  .get(protect, getItineraryById)
  .delete(protect, deleteItinerary);

router.patch('/:id/share', protect, toggleShareItinerary);

export default router;
