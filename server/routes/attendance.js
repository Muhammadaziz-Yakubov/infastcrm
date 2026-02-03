import express from 'express';
import Attendance from '../models/Attendance.js';
<<<<<<< HEAD
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate } from '../middleware/auth.js';
import mongoose from 'mongoose';
import { sendTelegramMessageToChat } from '../services/telegramBot.js';

const router = express.Router();

// Get attendance for a specific group and date
router.get('/:groupId/:date', authenticate, async (req, res) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({ message: 'Sorov vaqti tugadi. Iltimos qayta urinib koring.' });
    }
  }, 10000);

  try {
    const { groupId, date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      group_id: groupId,
      date: { $gte: startDate, $lte: endDate }
    }).maxTimeMS(8000);

    // Manual population for better performance and safety
    const studentIds = records.map(r => r.student_id);
    const students = await Student.find({ _id: { $in: studentIds } }).select('full_name profile_image phone').lean();

    const studentMap = new Map(students.map(s => [s._id.toString(), s]));

    const populatedRecords = records.map(record => ({
      ...record.toObject(),
      student_id: studentMap.get(record.student_id.toString()) || { _id: record.student_id, full_name: 'Noma\'lum o\'quvchi' }
    }));

    clearTimeout(timeout);
    res.json(populatedRecords);
  } catch (error) {
    clearTimeout(timeout);
=======
import Group from '../models/Group.js';
import { authenticate } from '../middleware/auth.js';

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
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// Bulk save attendance
router.post('/', authenticate, async (req, res) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({ message: 'Saqlash vaqti tugadi.' });
    }
  }, 15000);

  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance)) {
      const record = new Attendance(req.body);
      record.calculateCoins();
      await record.save();
      clearTimeout(timeout);
      return res.status(201).json(record);
    }

    const savedRecords = [];
    for (const data of attendance) {
      const { student_id, group_id, date, status } = data;

      const recordDate = new Date(date);
      recordDate.setHours(0, 0, 0, 0);

      const existing = await Attendance.findOne({
        student_id,
        group_id,
        date: {
          $gte: new Date(recordDate).setHours(0, 0, 0, 0),
          $lte: new Date(recordDate).setHours(23, 59, 59, 999)
        }
      });

      if (existing) {
        // Update fields if provided
        Object.keys(data).forEach(key => {
          if (key !== '_id' && key !== 'student_id' && key !== 'group_id' && key !== 'date') {
            existing[key] = data[key];
          }
        });

        if (data.status) existing.status = data.status.toUpperCase();

        existing.calculateCoins();
        await existing.save();
        savedRecords.push(existing);
      } else {
        const record = new Attendance({
          ...data,
          status: data.status ? data.status.toUpperCase() : 'ABSENT',
          date: recordDate
        });
        record.calculateCoins();
        await record.save();
        savedRecords.push(record);
      }
    }

    clearTimeout(timeout);
    res.json({ success: true, count: savedRecords.length });

    // Fire and forget Telegram update after response
    if (attendance.length > 0) {
      const gid = attendance[0].group_id;
      const group = await Group.findById(gid);
      if (group?.telegram_chat_id) {
        // You could trigger a summary here if needed
      }
    }
  } catch (error) {
    clearTimeout(timeout);
    console.error('Bulk attendance error:', error);
    if (!res.headersSent) {
      res.status(400).json({ message: error.message });
    }
  }
});

// GET / router with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { group_id, date } = req.query;
    let filter = {};

    if (group_id) filter.group_id = group_id;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(filter).limit(500);

    // Manual population
    const studentIds = [...new Set(attendance.map(a => a.student_id))];
    const groupIds = [...new Set(attendance.map(a => a.group_id))];

    const [students, groups] = await Promise.all([
      Student.find({ _id: { $in: studentIds } }).select('full_name').lean(),
      Group.find({ _id: { $in: groupIds } }).select('name').lean()
    ]);

    const studentMap = new Map(students.map(s => [s._id.toString(), s]));
    const groupMap = new Map(groups.map(g => [g._id.toString(), g]));

    const populated = attendance.map(a => ({
      ...a.toObject(),
      student_id: studentMap.get(a.student_id.toString()) || { _id: a.student_id, full_name: 'Noma\'lum' },
      group_id: groupMap.get(a.group_id.toString()) || { _id: a.group_id, name: 'Noma\'lum' }
    }));

    res.json(populated);
=======
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
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

