import axios from 'axios';

/**
 * @desc    Get current weather details for specific map coordinates (Lat/Lon)
 * @route   GET /api/v1/map/weather?lat=XX&lon=YY
 * @access  Public
 */
export const getLocationWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude coordinates are required' 
      });
    }

    const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Weather API key missing' });
    }

    // Using OpenWeather Current Weather Data API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await axios.get(weatherUrl, { timeout: 5000 });

    return res.status(200).json({
      success: true,
      data: {
        name: response.data.name || 'Selected Location',
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch weather data for this location' 
    });
  }
};