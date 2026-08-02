import { GoogleGenAI } from '@google/genai';
import ApiError from '../utils/ApiError.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Send structured prompt with live weather context to Gemini
 */
export const askWeatherAI = async (userMessage, weatherContext) => {
  try {
    const systemInstruction = `
You are SkyWise, an intelligent weather & lifestyle assistant.
Your goal is to provide concise, direct, and practical weather-based advice.

Current Live Weather Context for ${weatherContext.city}, ${weatherContext.country}:
- Temperature: ${weatherContext.temp}°C (Feels like: ${weatherContext.feelsLike}°C)
- Weather Condition: ${weatherContext.description}
- Humidity: ${weatherContext.humidity}%
- Wind Speed: ${weatherContext.windSpeed} m/s
- Air Quality Index (AQI): ${weatherContext.aqi} (Scale: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor)

Instructions for response:
1. Answer the user's specific question directly.
2. Rely on the metrics above to provide practical recommendations (attire, umbrellas, outdoor jogging, photography, travel).
3. Keep your response conversational, concise (2-4 sentences max), and easy to read.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }],
        },
      ],
    });

    return response.text;
  } catch (error) {
    throw new ApiError(500, error.message || 'Error communicating with AI service');
  }
};