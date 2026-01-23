import express from 'express';
import Attendance from '../models/Attendance.js';
import { authenticate } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get attendance for a specific group and date
router.get('/:groupId/:date', authenticate, async (req, res) => {
  try {
    const { groupId, date } = req.params;

    // Convert date string to start and end of day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      group_id: groupId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('student_id', 'full_name');

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk save attendance
router.post('/', authenticate, async (req, res) => {
  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance)) {
      // Fallback for single record if needed
      const record = new Attendance(req.body);
      record.calculateCoins();
      await record.save();
      return res.status(201).json(record);
    }

    const savedRecords = [];
    for (const data of attendance) {
      const { student_id, group_id, date, status } = data;

      // Convert date string to start of day
      const recordDate = new Date(date);
      recordDate.setHours(0, 0, 0, 0);

      // Find existing record for this student, group, and day
      const existing = await Attendance.findOne({
        student_id,
        group_id,
        date: {
          $gte: new Date(recordDate).setHours(0, 0, 0, 0),
          $lte: new Date(recordDate).setHours(23, 59, 59, 999)
        }
      });

      if (existing) {
        existing.status = status.toUpperCase();
        existing.calculateCoins();
        await existing.save();
        savedRecords.push(existing);
      } else {
        const record = new Attendance({
          ...data,
          status: status.toUpperCase(),
          date: recordDate
        });
        record.calculateCoins();
        await record.save();
        savedRecords.push(record);
      }
    }

    res.json({ success: true, count: savedRecords.length });
  } catch (error) {
    console.error('Bulk attendance error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Original GET / router for flexibility
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

    const attendance = await Attendance.find(filter)
      .populate('student_id', 'full_name')
      .populate('group_id', 'name');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
