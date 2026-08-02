import express from 'express';
import { addSearchHistory, getSearchHistory, clearSearchHistory } from '../controllers/historyController.js';
import  protect  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(addSearchHistory)
  .get(getSearchHistory)
  .delete(clearSearchHistory);

export default router;