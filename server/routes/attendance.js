import express from 'express';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import Student from '../models/Student.js';
import CoinHistory from '../models/CoinHistory.js';
import { authenticate } from '../middleware/auth.js';
import { sendAttendanceSummary, sendTelegramMessageToChat } from '../services/telegramBot.js';
import CoinService from '../services/CoinService.js';

const router = express.Router();

// Simple cache for attendance data
const attendanceCache = new Map();
const CACHE_TTL = 15000; // 15 seconds for attendance (changes frequently)

const getCachedAttendance = (cacheKey) => {
  const cached = attendanceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedAttendance = (cacheKey, data) => {
  attendanceCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // Clean old cache entries periodically
  if (attendanceCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of attendanceCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        attendanceCache.delete(key);
      }
    }
  }
};

// Get all attendance records
router.get('/', authenticate, async (req, res) => {
  const startTime = Date.now();
  
  // Set a timeout to prevent infinite hanging
  const timeout = setTimeout(() => {
    console.error('❌ Attendance query timeout after 10 seconds');
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Request timeout - please try again',
        timeout: true 
      });
    }
  }, 10000);

  try {
    const { group_id, student_id, date } = req.query;
    const filter = {};
    if (group_id) filter.group_id = group_id;
    if (student_id) filter.student_id = student_id;
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        clearTimeout(timeout);
        return res.status(400).json({ message: 'Invalid date format' });
      }
      const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Check cache first
    const cacheKey = JSON.stringify({ group_id, student_id, date });
    const cachedAttendance = getCachedAttendance(cacheKey);
    if (cachedAttendance) {
      console.log('📋 Using cached attendance data');
      clearTimeout(timeout);
      return res.json(cachedAttendance);
    }
    
    console.log(`🔍 Querying attendance with filter:`, filter);
    
    // Use Promise.all to handle population in parallel with proper error handling
    const attendance = await Attendance.find(filter)
      .select('student_id group_id date status')
      .sort({ date: -1 })
      .lean()
      .maxTimeMS(8000); // Increased timeout but still reasonable
    
    console.log(`📊 Found ${attendance.length} attendance records in ${Date.now() - startTime}ms`);
    
    // Safely populate data with error handling
    const studentIds = [...new Set(attendance.map(a => a.student_id).filter(id => id))];
    const groupIds = [...new Set(attendance.map(a => a.group_id).filter(id => id))];
    
    let students = [];
    let groups = [];
    
    if (studentIds.length > 0) {
      try {
        students = await Student.find({ _id: { $in: studentIds } })
          .select('full_name phone profile_image')
          .lean()
          .maxTimeMS(3000);
      } catch (studentError) {
        console.error('❌ Error populating students:', studentError.message);
        students = [];
      }
    }
    
    if (groupIds.length > 0) {
      try {
        groups = await Group.find({ _id: { $in: groupIds } })
          .select('name')
          .lean()
          .maxTimeMS(3000);
      } catch (groupError) {
        console.error('❌ Error populating groups:', groupError.message);
        groups = [];
      }
    }
    
    // Create lookup maps for efficient joining
    const studentMap = new Map(students.map(s => [s._id.toString(), s]));
    const groupMap = new Map(groups.map(g => [g._id.toString(), g]));
    
    // Manually populate the data with null-safety
    const populatedAttendance = attendance.map(record => {
      const student = studentMap.get(record.student_id?.toString());
      const group = groupMap.get(record.group_id?.toString());
      
      return {
        ...record,
        student_id: student || { 
          _id: record.student_id, 
          full_name: 'Unknown Student', 
          phone: '', 
          profile_image: '' 
        },
        group_id: group || { 
          _id: record.group_id, 
          name: 'Unknown Group' 
        }
      };
    });
    
    // Cache the results
    setCachedAttendance(cacheKey, populatedAttendance);
    
    clearTimeout(timeout);
    console.log(`✅ Attendance query completed in ${Date.now() - startTime}ms`);
    res.json(populatedAttendance);
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Attendance query error:', error);
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseServerSelectionError' || 
        error.message.includes('timeout') || 
        error.message.includes('exceeded')) {
      return res.status(500).json({ 
        message: 'Database timeout - please try again',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to fetch attendance records',
        error: error.message 
      });
    }
  }
});

// Get single attendance record
router.get('/:id', authenticate, async (req, res) => {
  const timeout = setTimeout(() => {
    console.error('❌ Single attendance query timeout after 5 seconds');
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Request timeout - please try again',
        timeout: true 
      });
    }
  }, 5000);

  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('student_id')
      .populate('group_id')
      .maxTimeMS(3000);
      
    clearTimeout(timeout);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    clearTimeout(timeout);
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseServerSelectionError' || 
        error.message.includes('timeout') || 
        error.message.includes('exceeded')) {
      return res.status(500).json({ 
        message: 'Database timeout - please try again',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Create or update attendance
router.post('/', authenticate, async (req, res) => {
  const startTime = Date.now();
  
  // Set a timeout to prevent infinite hanging
  const timeout = setTimeout(() => {
    console.error('❌ Attendance creation timeout after 15 seconds');
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Request timeout - please try again',
        timeout: true 
      });
    }
  }, 15000);

  try {
    // Check if group is ACTIVE
    const group = await Group.findById(req.body.group_id);
    if (!group) {
      clearTimeout(timeout);
      return res.status(404).json({ message: 'Group not found' });
    }
    if (group.status !== 'ACTIVE') {
      clearTimeout(timeout);
      return res.status(400).json({ message: 'Attendance can only be recorded for ACTIVE groups' });
    }

    // Try to find existing record
    const existing = await Attendance.findOne({
      student_id: req.body.student_id,
      group_id: req.body.group_id,
      date: new Date(req.body.date)
    }).maxTimeMS(5000);

    let attendance;
    if (existing) {
      // Update existing
      attendance = await Attendance.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true, runValidators: true }
      ).maxTimeMS(5000);
    } else {
      // Create new
      attendance = new Attendance(req.body);
      await attendance.save();
    }

    // Safely populate with error handling
    try {
      await attendance.populate('student_id').maxTimeMS(3000);
    } catch (popError) {
      console.error('❌ Error populating student:', popError.message);
    }
    
    try {
      await attendance.populate('group_id').maxTimeMS(3000);
    } catch (popError) {
      console.error('❌ Error populating group:', popError.message);
    }
    
    // Award or deduct coins based on attendance status (only for new records)
    if (!existing && attendance.student_id && attendance.group_id) {
      try {
        const existingCoin = await CoinHistory.findOne({
          related_id: attendance._id,
          reason_type: { $in: ['ATTENDANCE_PRESENT', 'ATTENDANCE_ABSENT'] }
        }).maxTimeMS(3000);
        
        if (!existingCoin && attendance.student_id._id) {
          if (attendance.status === 'PRESENT') {
            await CoinService.addCoins(
              attendance.student_id._id,
              50,
              `Darsga qatnashdi: ${attendance.group_id?.name || 'Unknown group'}`,
              'ATTENDANCE_PRESENT',
              null,
              attendance.group_id._id,
              attendance._id
            );
          } else if (attendance.status === 'ABSENT') {
            await CoinService.deductCoins(
              attendance.student_id._id,
              50,
              `Darsga kelmadi: ${attendance.group_id?.name || 'Unknown group'}`,
              'ATTENDANCE_ABSENT',
              null,
              attendance.group_id._id,
              attendance._id
            );
          }
        }
      } catch (coinError) {
        console.error('Error updating coins for attendance:', coinError);
        // Don't fail the request if coin operations fail
      }
    }
    
    // Send response BEFORE scheduling Telegram operations
    clearTimeout(timeout);
    console.log(`✅ Attendance record processed in ${Date.now() - startTime}ms`);
    res.status(201).json(attendance);
    
    // Schedule Telegram notifications AFTER response is sent (fire-and-forget with error handling)
    if (attendance.group_id?.telegram_chat_id) {
      console.log(`🔍 Checking group ${attendance.group_id.name} for telegram_chat_id: ${attendance.group_id.telegram_chat_id}`);

      // Send immediate test message first (with error handling)
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
          console.error('Error sending test message:', error.message);
        }
      }, 5000);

      // Send attendance summary after 10 minutes (with error handling)
      setTimeout(async () => {
        try {
          console.log(`⏰ Sending attendance summary for group ${attendance.group_id.name} now...`);
          await sendAttendanceSummary(attendance.group_id._id, attendance.date);
        } catch (error) {
          console.error('Error sending scheduled attendance summary:', error.message);
        }
      }, 10 * 60 * 1000);

      console.log(`⏰ Attendance summary scheduled for group ${attendance.group_id.name} in 10 minutes`);
    } else {
      console.log(`⚠️ Group ${attendance.group_id?.name || 'Unknown'} has no telegram_chat_id, skipping attendance summary`);
      console.log(`💡 To enable Telegram notifications, set telegram_chat_id in Groups settings`);
    }
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Attendance creation error:', error);
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseServerSelectionError' || 
        error.message.includes('timeout') || 
        error.message.includes('exceeded')) {
      return res.status(500).json({ 
        message: 'Database timeout - please try again',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    if (!res.headersSent) {
      res.status(400).json({ 
        message: 'Failed to create attendance record',
        error: error.message 
      });
    }
  }
});

// Update attendance
router.put('/:id', authenticate, async (req, res) => {
  const startTime = Date.now();
  
  // Set a timeout to prevent infinite hanging
  const timeout = setTimeout(() => {
    console.error('❌ Attendance update timeout after 10 seconds');
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Request timeout - please try again',
        timeout: true 
      });
    }
  }, 10000);

  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).maxTimeMS(5000);
    
    if (!attendance) {
      clearTimeout(timeout);
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Safely populate with error handling
    try {
      await attendance.populate('student_id').maxTimeMS(3000);
    } catch (popError) {
      console.error('❌ Error populating student:', popError.message);
    }
    
    try {
      await attendance.populate('group_id').maxTimeMS(3000);
    } catch (popError) {
      console.error('❌ Error populating group:', popError.message);
    }
    
    // Send response BEFORE scheduling Telegram operations
    clearTimeout(timeout);
    console.log(`✅ Attendance update processed in ${Date.now() - startTime}ms`);
    res.json(attendance);
    
    // Schedule attendance summary after 10 minutes when attendance is updated (fire-and-forget)
    if (attendance.group_id?.telegram_chat_id) {
      setTimeout(async () => {
        try {
          console.log(`⏰ Sending attendance summary for updated group ${attendance.group_id.name} now...`);
          await sendAttendanceSummary(attendance.group_id._id, attendance.date);
        } catch (error) {
          console.error('Error sending scheduled attendance summary:', error.message);
        }
      }, 10 * 60 * 1000);
      
      console.log(`⏰ Attendance summary scheduled for updated group ${attendance.group_id.name} in 10 minutes`);
    }
    
  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Attendance update error:', error);
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseServerSelectionError' || 
        error.message.includes('timeout') || 
        error.message.includes('exceeded')) {
      return res.status(500).json({ 
        message: 'Database timeout - please try again',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    if (!res.headersSent) {
      res.status(400).json({ 
        message: 'Failed to update attendance record',
        error: error.message 
      });
    }
  }
});

// Delete attendance
router.delete('/:id', authenticate, async (req, res) => {
  const timeout = setTimeout(() => {
    console.error('❌ Attendance deletion timeout after 5 seconds');
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Request timeout - please try again',
        timeout: true 
      });
    }
  }, 5000);

  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id)
      .maxTimeMS(3000);
      
    clearTimeout(timeout);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    clearTimeout(timeout);
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongooseServerSelectionError' || 
        error.message.includes('timeout') || 
        error.message.includes('exceeded')) {
      return res.status(500).json({ 
        message: 'Database timeout - please try again',
        error: 'DATABASE_TIMEOUT'
      });
    }
    
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});

export default router;

