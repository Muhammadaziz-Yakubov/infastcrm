import express from 'express';
import RatingService from '../services/RatingService.js';

const router = express.Router();

// 1. Get filters for ratings (Groups and Courses/Centers)
// Putting this above /ratings to avoid potential conflict
router.get('/filters', async (req, res) => {
  try {
    const filters = await RatingService.getFilters();
    res.json(filters);
  } catch (error) {
    console.error('❌ Error fetching rating filters:', error);
    res.status(500).json({ message: error.message });
  }
});

// 2. Optimized Global Ratings Endpoint with Filters
router.get('/ratings', async (req, res) => {
  try {
    const { groupId, courseId, limit } = req.query;
    const ratings = await RatingService.getGlobalRatings({
      groupId,
      courseId,
      limit: limit ? parseInt(limit) : 100
    });
    res.json(ratings);
  } catch (error) {
    console.error('❌ Error fetching global ratings:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
