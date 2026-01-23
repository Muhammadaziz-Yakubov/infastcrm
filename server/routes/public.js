import express from 'express';
import RatingService from '../services/RatingService.js';

const router = express.Router();

// Optimized Global Ratings Endpoint with Filters
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

// Get filters for ratings (Groups and Courses/Centers)
router.get('/ratings/filters', async (req, res) => {
  try {
    const filters = await RatingService.getFilters();
    res.json(filters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
