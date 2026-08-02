import SearchHistory from '../models/SearchHistory.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

/**
 * @desc    Save city to search history
 * @route   POST /api/v1/history
 * @access  Private (Requires JWT)
 */
export const addSearchHistory = async (req, res, next) => {
  try {
    const { city } = req.body;

    if (!city) {
      throw new ApiError(400, 'City name is required.');
    }

    const history = await SearchHistory.create({
      userId: req.user._id,
      city: city.trim(),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, history, 'Search history logged successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user recent searches
 * @route   GET /api/v1/history
 * @access  Private (Requires JWT)
 */
export const getSearchHistory = async (req, res, next) => {
  try {
    // Fetch last 10 unique recent searches
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ searchedAt: -1 })
      .limit(10);

    return res
      .status(200)
      .json(new ApiResponse(200, history, 'Search history retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all search history
 * @route   DELETE /api/v1/history
 * @access  Private (Requires JWT)
 */
export const clearSearchHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Search history cleared successfully'));
  } catch (error) {
    next(error);
  }
};