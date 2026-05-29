import fs from 'fs';
import pdfParse from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper to retry API calls with exponential backoff
 */
const withRetry = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 503 || error.status === 429) {
        attempt++;
        if (attempt >= maxRetries) throw error;
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(`Gemini API Error (${error.status}): Retrying in ${delay}ms... (Attempt ${attempt} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

/**
 * Extract text from PDF
 */
export const extractFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

/**
 * Extract text/info from Image using Gemini Vision
 */
export const extractFromImage = async (filePath, mimeType) => {
  try {
    // Read file into Base64
    const fileContent = fs.readFileSync(filePath);
    
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Extract all travel booking details from this image, such as dates, flights, hotels, names, and destinations.' },
            {
              inlineData: {
                data: fileContent.toString('base64'),
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    }));

    return response.text;
  } catch (error) {
    console.error('Error extracting from image via Gemini:', error);
    throw new Error('Failed to extract data from image.');
  }
};

/**
 * Generate Itinerary JSON from Extracted Text
 */
export const generateItinerary = async (extractedText) => {
  const prompt = `
You are a professional travel planner AI. Given the following extracted travel booking information, generate a detailed, day-by-day travel itinerary in valid JSON format only. No extra text, markdown formatting or backticks outside of what is required for standard JSON parsing.

Schema:
{
  "title": "string",
  "destination": "string",
  "departureCity": "string",
  "travelDates": { "from": "YYYY-MM-DD", "to": "YYYY-MM-DD" },
  "flightDetails": { "airline": "string", "flightNo": "string", "departure": "string", "arrival": "string" },
  "hotelDetails": { "name": "string", "checkIn": "string", "checkOut": "string", "roomType": "string" },
  "dailyPlan": [{ "day": 1, "date": "YYYY-MM-DD", "activities": ["string"] }],
  "travelTips": ["string"],
  "summary": "string"
}

Booking info:
${extractedText}
`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    }));

    const jsonText = response.text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating itinerary via Gemini:', error);
    throw new Error('Failed to generate itinerary JSON.');
  }
};
