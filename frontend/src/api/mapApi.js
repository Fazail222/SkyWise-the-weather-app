import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const mapApi = {
  /**
   * Fetches weather data for a specific latitude and longitude coordinate pair
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   */
  getWeatherByCoords: async (lat, lon) => {
    const response = await axios.get(`${baseURL}/weather/coords`, {
      params: { lat, lon },
    });
    return response.data;
  },
};