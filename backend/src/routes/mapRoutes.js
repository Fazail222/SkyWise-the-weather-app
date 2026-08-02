import express from 'express';
import { getWeatherTile } from '../controllers/mapController.js';

const router = express.Router();

router.get('/tiles/:layer/:z/:x/:y', getWeatherTile);

export default router;