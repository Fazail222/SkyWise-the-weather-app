import Favorites from '../models/Favorites.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Add city to user favorites
 * @route   POST /api/v1/favorites
 * @access  Private (Requires JWT)
 */
export const addFavorite = async (req, res, next) => {
  try {
    const { city, country } = req.body;

    if (!city) {
      throw new ApiError(400, 'City name is required.');
    }

    const existing = await Favorites.findOne({ userId: req.user._id, city: city.trim() });
    if (existing) {
      throw new ApiError(400, `'${city}' is already in your favorites.`);
    }

    const favorite = await Favorites.create({
      userId: req.user._id,
      city: city.trim(),
      country: country || '',
    });

    return res
      .status(201)
      .json(new ApiResponse(201, favorite, 'City added to favorites successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user favorite cities
 * @route   GET /api/v1/favorites
 * @access  Private (Requires JWT)
 */
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorites.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, favorites, 'Favorites retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove city from favorites
 * @route   DELETE /api/v1/favorites/:id
 * @access  Private (Requires JWT)
 */
export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorites.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!favorite) {
      throw new ApiError(404, 'Favorite record not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'City removed from favorites successfully'));
  } catch (error) {
    next(error);
  }
};