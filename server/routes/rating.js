import express from 'express';
import RatingService from '../services/RatingService.js';

const router = express.Router();
const ratingService = new RatingService();

// Admin power qo'shish o'chirildi, faqat public reyting ishlatiladi
// Bu route faqat compatibility uchun

export default router;