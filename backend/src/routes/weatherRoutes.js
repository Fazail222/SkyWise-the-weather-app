import express from 'express';
import { getWeather, getWeatherByCoordinates } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/v1/weather?city=Lahore
router.get('/', getWeather);

// GET /api/v1/weather/coords?lat=31.5204&lon=74.3587
router.get('/coords', getWeatherByCoordinates);

export default router;