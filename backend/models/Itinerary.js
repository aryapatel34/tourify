import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const itinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    generatedContent: {
      destination: String,
      departureCity: String,
      travelDates: {
        from: String,
        to: String,
      },
      flightDetails: {
        airline: String,
        flightNo: String,
        departure: String,
        arrival: String,
      },
      hotelDetails: {
        name: String,
        checkIn: String,
        checkOut: String,
        roomType: String,
      },
      dailyPlan: [
        {
          day: Number,
          date: String,
          activities: [String],
        },
      ],
      travelTips: [String],
      summary: String,
    },
    shareToken: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
