import express from 'express';
import CoinService from '../services/CoinService.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/award', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_ids, amount, reason } = req.body;

    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ message: 'Student IDs required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason required' });
    }

    const results = await CoinService.bulkAddCoins(
      student_ids,
      amount,
      reason,
      'ADMIN_MANUAL',
      req.user.userId
    );

    res.json({ 
      message: 'Coins awarded successfully',
      results 
    });
  } catch (error) {
    console.error('Award coins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/deduct', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_ids, amount, reason } = req.body;

    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return res.status(400).json({ message: 'Student IDs required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason required' });
    }

    const results = await CoinService.bulkDeductCoins(
      student_ids,
      amount,
      reason,
      'ADMIN_MANUAL',
      req.user.userId
    );

    res.json({ 
      message: 'Coins deducted successfully',
      results 
    });
  } catch (error) {
    console.error('Deduct coins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/award-group', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, amount, reason } = req.body;

    if (!group_id) {
      return res.status(400).json({ message: 'Group ID required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason required' });
    }

    const students = await Student.find({ group_id, status: 'ACTIVE' }).select('_id');
    const studentIds = students.map(s => s._id);

    if (studentIds.length === 0) {
      return res.status(404).json({ message: 'No active students in this group' });
    }

    const results = await CoinService.bulkAddCoins(
      studentIds,
      amount,
      reason,
      'ADMIN_MANUAL',
      req.user.userId,
      group_id
    );

    res.json({ 
      message: 'Coins awarded to group successfully',
      results 
    });
  } catch (error) {
    console.error('Award group coins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/deduct-group', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, amount, reason } = req.body;

    if (!group_id) {
      return res.status(400).json({ message: 'Group ID required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount required' });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason required' });
    }

    const students = await Student.find({ group_id, status: 'ACTIVE' }).select('_id');
    const studentIds = students.map(s => s._id);

    if (studentIds.length === 0) {
      return res.status(404).json({ message: 'No active students in this group' });
    }

    const results = await CoinService.bulkDeductCoins(
      studentIds,
      amount,
      reason,
      'ADMIN_MANUAL',
      req.user.userId,
      group_id
    );

    res.json({ 
      message: 'Coins deducted from group successfully',
      results 
    });
  } catch (error) {
    console.error('Deduct group coins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/balances', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, search } = req.query;
    
    let query = {};
    if (group_id) {
      query.group_id = group_id;
    }
    if (search) {
      query.full_name = { $regex: search, $options: 'i' };
    }

    const students = await Student.find(query)
      .select('full_name coin_balance group_id')
      .populate('group_id', 'name')
      .sort({ coin_balance: -1 });

    res.json(students);
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/history', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_id, group_id, limit = 100, skip = 0 } = req.query;

    let history;
    if (student_id) {
      history = await CoinService.getStudentHistory(student_id, parseInt(limit));
    } else if (group_id) {
      history = await CoinService.getGroupHistory(group_id, parseInt(limit));
    } else {
      history = await CoinService.getAllHistory(parseInt(limit), parseInt(skip));
    }

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/history/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await CoinService.deleteHistoryEntry(id, req.user.userId);

    res.json({ 
      message: 'History entry deleted successfully',
      student: result.student
    });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
