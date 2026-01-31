import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';
import RatingService from '../services/RatingService.js';

const router = express.Router();
const ratingService = new RatingService();

// Rating endpointlari o'chirildi, faqat student reytingi ishlatiladi

export default router;