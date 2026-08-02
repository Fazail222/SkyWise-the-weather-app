import { askWeatherAI } from '../services/aiService.js';
import { fetchWeatherByCity } from '../services/weatherService.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Chat with SkyWise AI Weather Assistant
 * @route   POST /api/v1/ai/chat
 * @access  Public (Optional: Protect with authMiddleware if desired)
 */
export const handleAIChat = async (req, res, next) => {
  try {
    const { city, message } = req.body;

    if (!city || !message) {
      throw new ApiError(400, 'Both city and message are required.');
    }

    // 1. Fetch real-time weather metrics for AI context
    const weatherData = await fetchWeatherByCity(city);

    // 2. Build lean context payload for prompt
    const weatherContext = {
      city: weatherData.location.city,
      country: weatherData.location.country,
      temp: weatherData.current.temp,
      feelsLike: weatherData.current.feelsLike,
      description: weatherData.current.description,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      aqi: weatherData.airQuality.aqi,
    };

    // 3. Generate response via Gemini
    const aiReply = await askWeatherAI(message, weatherContext);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          city: weatherData.location.city,
          userMessage: message,
          aiReply,
        },
        'AI insight generated successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};