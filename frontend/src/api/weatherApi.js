// frontend/src/api/weatherApi.js
import api from './axios';

export const weatherApi = {
  getWeatherByCity: (city) => 
    api.get(`/weather?city=${encodeURIComponent(city)}`),

  // Accept { lat, lon } as a single object parameter
  getWeatherByCoords: ({ lat, lon }) => 
    api.get(`/weather/coords?lat=${lat}&lon=${lon}`),
};