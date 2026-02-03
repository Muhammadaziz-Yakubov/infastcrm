import express from 'express';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
<<<<<<< HEAD
import mongoose from 'mongoose';

const router = express.Router();

// Simple cache for students data
const studentsCache = new Map();
const CACHE_TTL = 30000; // 30 seconds

const getCachedStudents = (cacheKey) => {
  const cached = studentsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedStudents = (cacheKey, data) => {
  studentsCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  // Clean old cache entries periodically
  if (studentsCache.size > 50) {
    const now = Date.now();
    for (const [key, value] of studentsCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        studentsCache.delete(key);
      }
    }
  }
};

// Get all students
router.get('/', authenticate, requireAdmin, async (req, res) => {
  // Declare filter outside try block for fallback access
  let filter = {};

  try {
    const { group_id, status, payment_filter } = req.query;
    console.log('🔍 Students query params:', { group_id, status, payment_filter });

    // Reset filter for this request
    filter = {};
    if (group_id) {
      try {
        // Convert to ObjectId for proper MongoDB query
        filter.group_id = new mongoose.Types.ObjectId(group_id);
      } catch (error) {
        console.error('❌ Invalid group_id format:', group_id);
        filter.group_id = group_id; // Fallback to string
      }
    }

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

    console.log('🔍 Students filter:', filter);

    // Check cache first
    const cacheKey = JSON.stringify({ group_id, status, payment_filter });
    const cachedStudents = getCachedStudents(cacheKey);
    if (cachedStudents) {
      console.log('📋 Using cached students data');
      return res.json(cachedStudents);
    }

    // Add timeout and better error handling
    let students = await Student.find(filter)
      .select('full_name phone status group_id coin_balance profile_image next_payment_date login')
      .populate('group_id', 'name status')
      .sort({ full_name: 1 })
      .lean()
      .maxTimeMS(10000) // Increased from 5000 to 10000
      .allowDiskUse(true); // For complex queries

    // Additional validation: if group_id is specified, verify students belong to active groups
    if (group_id) {
      const group = await Group.findById(new mongoose.Types.ObjectId(group_id)).select('status').maxTimeMS(2000);
      if (group && group.status !== 'ACTIVE') {
        console.log(`⚠️ Group ${group_id} is not ACTIVE (${group.status}), but returning students anyway`);
      }

      // Log if no students found for this group
      if (students.length === 0) {
        console.log(`❌ No students found for group ${group_id} with filter:`, filter);

        // Try without status filter to see if students exist with different status
        const allStudentsInGroup = await Student.find({ group_id: new mongoose.Types.ObjectId(group_id) })
          .select('full_name status')
          .maxTimeMS(3000);

        if (allStudentsInGroup.length > 0) {
          console.log(`📊 Found ${allStudentsInGroup.length} students with different statuses:`);
          allStudentsInGroup.forEach(s => {
            console.log(`   - ${s.full_name} (${s.status})`);
          });
        } else {
          console.log(`📊 No students at all in group ${group_id}`);
        }
      }
    }

    console.log('📊 Found students count:', students.length);

    // Cache the results
    setCachedStudents(cacheKey, students);

    res.json(students);
  } catch (error) {
    console.error('❌ Students query error:', error.message);

    // Fallback: try without populate if timeout
    if (error.message.includes('timeout') || error.message.includes('connection')) {
      try {
        console.log('🔄 Trying fallback without populate...');
        const students = await Student.find(filter)
          .select('full_name phone status group_id coin_balance profile_image next_payment_date login')
          .sort({ full_name: 1 })
          .lean()
          .maxTimeMS(3000);

        console.log('📊 Fallback students count:', students.length);
        res.json(students);
        return;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
      }
    }

    res.status(500).json({
      message: 'Database connection error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
=======

const router = express.Router();

// Get all students
router.get('/', authenticate, async (req, res) => {
  try {
    const { group_id, status } = req.query;
    const filter = {};
    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;

    const students = await Student.find(filter)
      .populate('group_id')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  }
});

// Get single student
<<<<<<< HEAD
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
=======
router.get('/:id', authenticate, async (req, res) => {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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
<<<<<<< HEAD
router.get('/check-login/:login', authenticate, requireAdmin, async (req, res) => {
=======
router.get('/check-login/:login', authenticate, async (req, res) => {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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
<<<<<<< HEAD
    console.log('📝 Creating student with data:', req.body);
    const { login, password, ...studentData } = req.body;

=======
    const { login, password, ...studentData } = req.body;
    
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    // Check if login already exists
    if (login) {
      const existingStudent = await Student.findOne({ login });
      if (existingStudent) {
        return res.status(400).json({ message: 'Bu login allaqachon band' });
      }
    }

    const student = new Student({
      ...studentData,
<<<<<<< HEAD
      login: login || undefined,
      password
    });

    await student.save();
    await student.populate('group_id');
    console.log('✅ Student created successfully:', student);
    res.status(201).json(student);
  } catch (error) {
    console.error('❌ Error creating student:', error);
=======
      login,
      password
    });
    
    await student.save();
    await student.populate('group_id');
    res.status(201).json(student);
  } catch (error) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(400).json({ message: error.message });
  }
});

// Update student (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { login, password, ...updateData } = req.body;
<<<<<<< HEAD

=======
    
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    // Check if login already exists for different student
    if (login) {
      const existingStudent = await Student.findOne({ login, _id: { $ne: req.params.id } });
      if (existingStudent) {
        return res.status(400).json({ message: 'Bu login allaqachon band' });
      }
      updateData.login = login;
<<<<<<< HEAD
    } else if (login === "") {
      updateData.login = null;
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    }

    // Get current student to update
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    // Update fields
    Object.assign(student, updateData);
<<<<<<< HEAD

=======
    
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    // If password is provided, update it (will be hashed by pre-save hook)
    if (password) {
      student.password = password;
    }

    await student.save();
    await student.populate('group_id');
<<<<<<< HEAD

=======
    
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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
