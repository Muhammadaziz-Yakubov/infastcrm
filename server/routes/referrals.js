import express from 'express';
import jwt from 'jsonwebtoken';
import ReferralService from '../services/ReferralService.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Referral from '../models/Referral.js';
import CoinHistory from '../models/CoinHistory.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { friend_name, friend_phone } = req.body;
    const authHeader = req.headers.authorization;

    if (!friend_name || !friend_phone) {
      return res.status(400).json({ message: 'Ism va telefon raqami talab qilinadi' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Avtorizatsiya talab etiladi' });
    }

    const token = authHeader.substring(7);
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return res.status(401).json({ message: 'Token yaroqsiz' });
    }

    if (decoded.type !== 'student') {
      return res.status(401).json({ message: 'Faqat studentlar referral yuborishi mumkin' });
    }

    // Get student from decoded token
    const student = await Student.findById(decoded.studentId);
    if (!student) {
      return res.status(401).json({ message: 'O\'quvchi topilmadi' });
    }

    // Check if friend already exists
    const existingFriend = await Student.findOne({ phone: friend_phone });
    let friendId;

    if (existingFriend) {
      friendId = existingFriend._id;
    } else {
      // Create new student record for friend with PENDING status
      const newFriend = new Student({
        full_name: friend_name,
        phone: friend_phone,
        status: 'PENDING',
        coin_balance: 0
      });
      const savedFriend = await newFriend.save();
      friendId = savedFriend._id;
    }

    // Check if referral already exists
    const existingReferral = await Referral.findOne({
      referrer_id: student._id,
      friend_id: friendId
    });

    if (existingReferral) {
      return res.status(400).json({ message: 'Bu taklif allaqachon yuborilgan' });
    }

    // Create referral with PENDING status
    const referral = new Referral({
      referrer_id: student._id,
      friend_id: friendId,
      admin_id: null, // Will be assigned when admin processes
      status: 'PENDING',
      notes: `Student submission: ${friend_name} - ${friend_phone}`
    });

    await referral.save();

    res.status(201).json({
      message: 'Taklif muvaffaqiyatli yuborildi',
      referral
    });
  } catch (error) {
    console.error('Referral submit xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

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

router.post('/start/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Taklif topilmadi' });
    }

    if (referral.status !== 'PENDING') {
      return res.status(400).json({ message: 'Faqat PENDING statusdagi takliflarni boshlash mumkin' });
    }

    referral.status = 'ACTIVE';
    referral.admin_id = req.user.userId;
    referral.approved_date = new Date();
    await referral.save();

    res.json({
      message: 'Taklif jarayoni boshlandi',
      referral
    });
  } catch (error) {
    console.error('Taklifni boshlashda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/complete/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id).populate('referrer_id');
    if (!referral) {
      return res.status(404).json({ message: 'Taklif topilmadi' });
    }

    if (referral.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Faqat ACTIVE statusdagi takliflarni tugatish mumkin' });
    }

    referral.status = 'COMPLETED';
    
    // Add 1000 coins to referrer
    const referrer = await Student.findById(referral.referrer_id._id);
    if (referrer) {
      referrer.coin_balance = (referrer.coin_balance || 0) + 1000;
      await referrer.save();

      // Create coin history record
      const coinHistory = new CoinHistory({
        student_id: referrer._id,
        amount: 1000,
        type: 'REFERRAL_BONUS',
        reason: `Do'st taklifi uchun bonus: ${referral.friend_id}`,
        reason_type: 'REFERRAL_BONUS',
        balance_after: referrer.coin_balance
      });
      await coinHistory.save();
    }

    await referral.save();

    res.json({
      message: 'Taklif muvaffaqiyatli tugatildi va 1000 coin berildi',
      referral
    });
  } catch (error) {
    console.error('Taklifni tugatishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/reject/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rad etish sababi talab qilinadi' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Taklif topilmadi' });
    }

    referral.status = 'CANCELLED';
    referral.notes = `${referral.notes}\nRad etildi: ${reason}`;
    referral.admin_id = req.user.userId;
    await referral.save();

    res.json({
      message: 'Taklif rad etildi',
      referral
    });
  } catch (error) {
    console.error('Taklifni rad etishda xatolik:', error);
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

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral topilmadi' });
    }

    await Referral.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Referral muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Referral o\'chirishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
