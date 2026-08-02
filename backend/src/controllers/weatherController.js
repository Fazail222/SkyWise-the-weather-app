import { fetchWeatherByCity, fetchWeatherByCoords } from '../services/weatherService.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Get Current Weather, AQI, Hourly & 7-Day Forecast by City Name
 * @route   GET /api/v1/weather?city=Lahore
 * @access  Public
 */
export const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      throw new ApiError(400, 'City query parameter is required');
    }

    const weatherData = await fetchWeatherByCity(city);
    return res
      .status(200)
      .json(new ApiResponse(200, weatherData, 'Weather data fetched successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Weather, AQI & Forecast by Geolocation Coordinates
 * @route   GET /api/v1/weather/coords?lat=31.5204&lon=74.3587
 * @access  Public
 */
/**
 * Fetch Weather by Lat/Lon Coordinates
 */
export const getWeatherByCoordinates = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    // Debugging check (remove after testing)
    console.log("Received Query Params:", { lat, lon });

    if (!lat || !lon) {
      throw new ApiError(400, 'Latitude (lat) and Longitude (lon) are required');
    }

    const weatherData = await fetchWeatherByCoords(lat, lon);
    return res
      .status(200)
      .json(new ApiResponse(200, weatherData, 'Weather data fetched successfully'));
  } catch (error) {
    next(error);
  }
};