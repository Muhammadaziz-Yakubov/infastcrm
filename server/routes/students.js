import express from 'express';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all students
router.get('/', authenticate, async (req, res) => {
  try {
    const { group_id, status, payment_filter } = req.query;
    const filter = {};
    if (group_id) filter.group_id = group_id;
    
    // Handle special payment filters
    if (payment_filter === 'PAYMENT_DUE') {
      // To'lov muddati yaqinlashgan (3 kun ichida) - DEBTOR larni ham qo'shamiz
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      
      filter.next_payment_date = {
        $gte: today,
        $lte: threeDaysLater
      };
      filter.status = { $nin: ['STOPPED'] }; // DEBTOR larni ham qo'shamiz
    } else if (payment_filter === 'OVERDUE') {
      // To'lov muddati o'tgan (lekin hali DEBTOR emas)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filter.next_payment_date = { $lt: today };
      filter.status = { $nin: ['STOPPED', 'DEBTOR'] };
    } else if (status) {
      filter.status = status;
    }

    const students = await Student.find(filter)
      .select('full_name phone status group_id coin_balance profile_image next_payment_date')
      .populate('group_id', 'name status')
      .sort({ full_name: 1 })
      .lean();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student
router.get('/:id', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('group_id');
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if login is unique
router.get('/check-login/:login', authenticate, async (req, res) => {
  try {
    const existing = await Student.findOne({ login: req.params.login });
    res.json({ exists: !!existing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('📝 Creating student with data:', req.body);
    const { login, password, ...studentData } = req.body;
    
    // Check if login already exists
    if (login) {
      const existingStudent = await Student.findOne({ login });
      if (existingStudent) {
        return res.status(400).json({ message: 'Bu login allaqachon band' });
      }
    }

    const student = new Student({
      ...studentData,
      login,
      password
    });
    
    await student.save();
    await student.populate('group_id');
    console.log('✅ Student created successfully:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('❌ Error creating student:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update student (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { login, password, ...updateData } = req.body;
    
    // Check if login already exists for different student
    if (login) {
      const existingStudent = await Student.findOne({ login, _id: { $ne: req.params.id } });
      if (existingStudent) {
        return res.status(400).json({ message: 'Bu login allaqachon band' });
      }
      updateData.login = login;
    }

    // Get current student to update
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    // Update fields
    Object.assign(student, updateData);
    
    // If password is provided, update it (will be hashed by pre-save hook)
    if (password) {
      student.password = password;
    }

    await student.save();
    await student.populate('group_id');
    
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }
    res.json({ message: 'O\'quvchi o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
