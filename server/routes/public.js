import express from 'express';
import RatingService from '../services/RatingService.js';

const router = express.Router();

// Optimized Global Ratings Endpoint
router.get('/ratings', async (req, res) => {
  try {
    const ratings = await RatingService.getGlobalRatings();
    res.json(ratings);
  } catch (error) {
    console.error('❌ Error fetching global ratings:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
