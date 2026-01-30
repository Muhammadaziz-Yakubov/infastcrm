import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';

const router = express.Router();

// Add power to student
router.post('/add-power', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_id, power, reason } = req.body;

    console.log('Power qo\'shish so\'rovi:', { student_id, power, reason });

    if (!student_id || power === undefined || power === null || !reason) {
      return res.status(400).json({ 
        message: 'Student ID, power miqdori va sabab talab qilinadi' 
      });
    }

    if (power <= 0) {
      return res.status(400).json({ 
        message: 'Power miqdori 0 dan katta bo\'lishi kerak' 
      });
    }

    // Get student
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    console.log('Topilgan student:', student.full_name, 'current coin_balance:', student.coin_balance);

    // Add power to student (assuming power is stored in coin_balance)
    const currentBalance = student.coin_balance || 0;
    const newBalance = currentBalance + power;
    
    student.coin_balance = newBalance;
    await student.save();

    console.log('Yangilangan coin_balance:', newBalance);

    // Create coin history record
    const coinHistory = new CoinHistory({
      student_id: student._id,
      amount: power,
      type: 'ADMIN_ADD',
      reason: reason,
      reason_type: 'ADMIN_MANUAL',
      balance_after: newBalance,
      admin_id: req.user.id
    });
    await coinHistory.save();

    console.log('Coin history yaratildi');

    res.json({
      message: `${power} power muvaffaqiyatli qo'shildi`,
      student: {
        id: student._id,
        name: student.full_name,
        previous_balance: currentBalance,
        new_balance: newBalance,
        power_added: power
      }
    });
  } catch (error) {
    console.error('Power qo\'shishda xatolik:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
