import { Rating } from '../models/Rating.js';

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().lean();
    res.json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json({ rating });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=MV101
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const result = await Rating.aggregate([
      {
        $match: { movieCode: movieCode },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    const summary = result[0];
    res.json({
      movieCode,
      averageRating: summary.averageRating,
      ratingCount: summary.ratingCount,
    });
  } catch (err) {
    next(err);
  }
}
