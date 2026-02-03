import express from 'express';
import Group from '../models/Group.js';
import Student from '../models/Student.js';
import Lead from '../models/Lead.js';
import Attendance from '../models/Attendance.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { sendTelegramMessageToChat, sendAttendanceSummary } from '../services/telegramBot.js';

const router = express.Router();

// Get all groups
router.get('/', authenticate, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('course_id')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single group
router.get('/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('course_id');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create group
router.post('/', authenticate, async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    await group.populate('course_id');
    // Send test message to Telegram group if chat_id provided
    if (group.telegram_chat_id) {
      try {
        const testMessage = `
🎉 <b>GURUH QO'SHILDI!</b>

🏷️ <b>Guruh:</b> ${group.name}
📚 <b>Kurs:</b> ${group.course_id?.name || 'Noma\'lum'}
📅 <b>Kunlar:</b> ${group.days_of_week.join(', ')}
⏰ <b>Vaqt:</b> ${group.time || 'Belgilanmagan'}
👥 <b>O'quvchilar:</b> ${group.min_students}-${group.max_students} kishi

🤖 InFast CRM bot guruhga muvaffaqiyatli ulandi!
Endi guruhga avtomatik eslatmalar yuboriladi.
        `.trim();

        await sendTelegramMessageToChat(group.telegram_chat_id, testMessage);
        console.log(`✅ Test message sent to group ${group.name}`);
      } catch (telegramError) {
        console.error(`❌ Failed to send test message to group ${group.name}:`, telegramError.message);
      }
    }
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update group
router.put('/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course_id');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Activate group (NABOR → ACTIVE)
router.post('/:id/activate', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.status !== 'NABOR') {
      return res.status(400).json({ message: 'Group is not in NABOR status' });
    }

    // Count students in group
    const studentCount = await Student.countDocuments({ group_id: group._id });

    if (studentCount < group.min_students) {
      return res.status(400).json({
        message: `Minimum ${group.min_students} students required. Current: ${studentCount}`
      });
    }

    if (!req.body.start_date) {
      return res.status(400).json({ message: 'start_date is required' });
    }

    // Update group status
    group.status = 'ACTIVE';
    group.start_date = new Date(req.body.start_date);
    await group.save();

    // Convert all leads to students
    const leads = await Lead.find({ group_id: group._id });
    for (const lead of leads) {
      const existingStudent = await Student.findOne({
        phone: lead.phone,
        group_id: group._id
      });
      if (!existingStudent) {
        const student = new Student({
          full_name: lead.name,
          phone: lead.phone,
          group_id: group._id,
          status: 'ACTIVE'
        });
        await student.save();
      }
    }

    await group.populate('course_id');
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete group
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send attendance message to group
router.post('/:id/send-attendance', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.body;
    console.log(`📤 Sending attendance message for group ${req.params.id} on date ${date}`);

    // Refresh group data before sending
    const group = await Group.findById(req.params.id).populate('course_id');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    console.log(`📋 Group found: ${group.name} with chat_id: ${group.telegram_chat_id}`);

    await sendAttendanceSummary(req.params.id, date);
    res.json({ message: 'Attendance message sent successfully' });
  } catch (error) {
    console.error('Error sending attendance message:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send scores message to group
router.post('/:id/send-scores', authenticate, requireAdmin, async (req, res) => {
  try {
    const { date } = req.body;
    console.log(`📤 Sending scores message for group ${req.params.id} on date ${date}`);

    const group = await Group.findById(req.params.id).populate('course_id');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.telegram_chat_id) {
      return res.status(404).json({ message: 'Group has no chat ID' });
    }

    console.log(`📋 Group found: ${group.name} with chat_id: ${group.telegram_chat_id}`);

    // Get today's attendance records
    const attendanceRecords = await Attendance.find({
      group_id: req.params.id,
      date: new Date(date)
    }).populate('student_id');

    // Get present students with scores
    const presentStudents = attendanceRecords
      .filter(record => record.status === 'PRESENT')
      .map(record => ({
        ...record.student_id.toObject(),
        score: record.score || 0
      }));

    if (presentStudents.length === 0) {
      return res.status(404).json({ message: 'No present students found for today' });
    }

    // Format scores message
    const today = new Date().toLocaleDateString('uz-UZ');
    let message = `
🎯 <b>BUGUNGI DARS BALLARI</b>

🏷️ <b>Guruh:</b> ${group.name}
📅 <b>Sana:</b> ${today}
📚 <b>Kurs:</b> ${group.course_id?.name || 'Noma\'lum'}

📊 <b>Kelgan o'quvchilar:</b> ${presentStudents.length} ta

📝 <b>Ballar ro'yxati:</b>
    `.trim();

    const scoresList = presentStudents.map((student, index) => {
      return `${index + 1}. <b>${student.full_name}</b>
   🎯 <b>Ball:</b> ${student.score || 0}`;
    }).join('\n\n');

    message += `\n\n${scoresList}`;

    await sendTelegramMessageToChat(group.telegram_chat_id, message);
    res.json({ message: 'Scores message sent successfully' });
  } catch (error) {
    console.error('Error sending scores message:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get students in group
router.get('/:id/students', authenticate, async (req, res) => {
  try {
    const students = await Student.find({ group_id: req.params.id })
      .sort({ full_name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;

