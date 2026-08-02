import axios from 'axios';

/**
 * @desc    Proxy OpenWeather Radar / Weather Tiles to Google Maps
 * @route   GET /api/v1/map/tiles/:layer/:z/:x/:y
 * @access  Public
 */
export const getWeatherTile = async (req, res, next) => {
  try {
    const { layer, z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Weather API key missing' });
    }

    const tileUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;
    
    const response = await axios.get(tileUrl, { 
      responseType: 'arraybuffer',
      timeout: 5000, // 5s timeout to prevent hung requests
    });
    
    // Set 1-hour browser cache so repeated map pans don't re-fetch identical tiles
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    });

    return res.send(Buffer.from(response.data));
  } catch (error) {
    // Fail gracefully with a 404 or empty image if tile not found
    return res.status(404).end();
  }
};