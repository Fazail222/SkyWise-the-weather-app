import express from 'express';
import { getLocationWeather } from '../controllers/mapController.js';

const router = express.Router();

// GET /api/v1/map/weather?lat=XX&lon=YY
router.get('/weather', getLocationWeather);

export default router;