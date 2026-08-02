import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import  protect  from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply Auth Protection Middleware to all Favorite routes
router.use(protect);

router.route('/')
  .post(addFavorite)
  .get(getFavorites);

router.delete('/:id', removeFavorite);

export default router;