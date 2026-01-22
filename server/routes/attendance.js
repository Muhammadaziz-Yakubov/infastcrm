import express from 'express';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';
import { authenticate } from '../middleware/auth.js';
import { sendAttendanceSummary, sendTelegramMessageToChat } from '../services/telegramBot.js';
import CoinService from '../services/CoinService.js';

const router = express.Router();

// Get all attendance records
router.get('/', authenticate, async (req, res) => {
  try {
    const { group_id, student_id, date } = req.query;
    const filter = {};
    if (group_id) filter.group_id = group_id;
    if (student_id) filter.student_id = student_id;
    if (date) {
      const dateObj = new Date(date);
      const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(filter)
      .populate('student_id')
      .populate('group_id')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single attendance record
router.get('/:id', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student_id')
      .populate('group_id');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update attendance
router.post('/', authenticate, async (req, res) => {
  try {
    // Check if group is ACTIVE
    const group = await Group.findById(req.body.group_id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (group.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Attendance can only be recorded for ACTIVE groups' });
    }

    // Try to find existing record
    const existing = await Attendance.findOne({
      student_id: req.body.student_id,
      group_id: req.body.group_id,
      date: new Date(req.body.date)
    });

    let attendance;
    if (existing) {
      // Update existing
      attendance = await Attendance.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      attendance = new Attendance(req.body);
      await attendance.save();
    }

    await attendance.populate('student_id');
    await attendance.populate('group_id');
    
    // Award or deduct coins based on attendance status (only for new records)
    if (!existing) {
      try {
        const existingCoin = await CoinHistory.findOne({
          related_id: attendance._id,
          reason_type: { $in: ['ATTENDANCE_PRESENT', 'ATTENDANCE_ABSENT'] }
        });
        
        if (!existingCoin) {
          if (attendance.status === 'PRESENT') {
            await CoinService.addCoins(
              attendance.student_id._id,
              50,
              `Darsga qatnashdi: ${attendance.group_id.name}`,
              'ATTENDANCE_PRESENT',
              null,
              attendance.group_id._id,
              attendance._id
            );
          } else if (attendance.status === 'ABSENT') {
            await CoinService.deductCoins(
              attendance.student_id._id,
              50,
              `Darsga kelmadi: ${attendance.group_id.name}`,
              'ATTENDANCE_ABSENT',
              null,
              attendance.group_id._id,
              attendance._id
            );
          }
        }
      } catch (coinError) {
        console.error('Error updating coins for attendance:', coinError);
      }
    }
    
    // Schedule attendance summary after 10 minutes
    console.log(`🔍 Checking group ${attendance.group_id.name} for telegram_chat_id: ${attendance.group_id.telegram_chat_id}`);

    if (attendance.group_id.telegram_chat_id) {
      // Send immediate test message first
      setTimeout(async () => {
        try {
          console.log(`🚀 Sending immediate test message to group ${attendance.group_id.name}...`);
          const testMessage = `📊 <b>Test Message</b>

Group: ${attendance.group_id.name}
Time: ${new Date().toISOString()}
Status: Testing bot connectivity

This message will be followed by attendance summary in 10 minutes.`;
          await sendTelegramMessageToChat(attendance.group_id.telegram_chat_id, testMessage);
        } catch (error) {
          console.error('Error sending test message:', error);
        }
      }, 5000); // 5 seconds

      setTimeout(async () => {
        try {
          console.log(`⏰ Sending attendance summary for group ${attendance.group_id.name} now...`);
          await sendAttendanceSummary(attendance.group_id._id, attendance.date);
        } catch (error) {
          console.error('Error sending scheduled attendance summary:', error);
          console.error('Full error details:', error);
        }
      }, 10 * 60 * 1000); // 10 minutes in milliseconds

      console.log(`⏰ Attendance summary scheduled for group ${attendance.group_id.name} in 10 minutes`);
    } else {
      console.log(`⚠️ Group ${attendance.group_id.name} has no telegram_chat_id, skipping attendance summary`);
      console.log(`💡 To enable Telegram notifications, set telegram_chat_id in Groups settings`);
    }
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance
router.put('/:id', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('student_id')
      .populate('group_id');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Note: Coins are NOT updated when attendance is edited to prevent duplicate awards
    
    // Schedule attendance summary after 10 minutes when attendance is updated
    if (attendance.group_id.telegram_chat_id) {
      setTimeout(async () => {
        try {
          console.log(`⏰ Sending attendance summary for updated group ${attendance.group_id.name} now...`);
          await sendAttendanceSummary(attendance.group_id._id, attendance.date);
        } catch (error) {
          console.error('Error sending scheduled attendance summary:', error);
        }
      }, 10 * 60 * 1000); // 10 minutes in milliseconds
      
      console.log(`⏰ Attendance summary scheduled for updated group ${attendance.group_id.name} in 10 minutes`);
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

