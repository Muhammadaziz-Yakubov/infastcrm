import express from 'express';
import ReferralService from '../services/ReferralService.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, requireAdmin, async (req, res) => {
  try {
    const { referrer_id, friend_id, notes } = req.body;

    if (!referrer_id || !friend_id) {
      return res.status(400).json({ message: 'Referrer va Friend ID talab qilinadi' });
    }

    if (referrer_id === friend_id) {
      return res.status(400).json({ message: 'Talaba o\'zini referral qila olmaydi' });
    }

    const referral = await ReferralService.createReferral(
      referrer_id,
      friend_id,
      req.user.userId,
      notes
    );

    res.status(201).json({
      message: 'Referral muvaffaqiyatli yaratildi',
      referral
    });
  } catch (error) {
    console.error('Referral yaratishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/approve/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const referral = await ReferralService.approveReferral(
      req.params.id,
      req.user.userId
    );

    res.json({
      message: 'Referral tasdiqlandi',
      referral
    });
  } catch (error) {
    console.error('Referral tasdiqlashda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/cancel/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Bekor qilish sababi talab qilinadi' });
    }

    const referral = await ReferralService.cancelReferral(
      req.params.id,
      req.user.userId,
      reason
    );

    res.json({
      message: 'Referral bekor qilindi',
      referral
    });
  } catch (error) {
    console.error('Referral bekor qilishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const referrals = await ReferralService.getAllReferrals(status);

    res.json({ referrals });
  } catch (error) {
    console.error('Referrallarni olishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/by-referrer/:referrerId', authenticate, requireAdmin, async (req, res) => {
  try {
    const referrals = await ReferralService.getReferralsByReferrer(req.params.referrerId);
    res.json({ referrals });
  } catch (error) {
    console.error('Referrer referrallarini olishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/by-friend/:friendId', authenticate, requireAdmin, async (req, res) => {
  try {
    const referral = await ReferralService.getReferralsByFriend(req.params.friendId);
    res.json({ referral });
  } catch (error) {
    console.error('Friend referralini olishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/statistics', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = await ReferralService.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Referral statistikasini olishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
