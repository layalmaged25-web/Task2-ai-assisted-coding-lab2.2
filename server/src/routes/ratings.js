import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary must come before /:id to avoid being treated as an ID
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;
