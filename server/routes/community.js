import express from 'express';
import { authenticateStudent } from '../middleware/auth.js';
import Student from '../models/Student.js';
import Message from '../models/Message.js';
import communityService from '../services/CommunityService.js';

const router = express.Router();

// Get all messages with pagination
router.get('/messages', authenticateStudent, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.getRecentMessages(parseInt(limit));
    
    // Reverse to show newest first (since getRecentMessages returns newest first)
    const reversedMessages = messages.reverse();
    
    res.json({
      messages: reversedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ is_deleted: false })
      }
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

// Send new message
router.post('/messages', authenticateStudent, async (req, res) => {
  try {
    const { message, type = 'text', reply_to } = req.body;
    const student = req.student;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Xabar bo\'sh bo\'lishi mumkin emas' });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ message: 'Xabar 1000 ta belgidan oshmasligi kerak' });
    }

    // Create new message in database
    const newMessage = new Message({
      student_id: student._id,
      student_name: student.full_name,
      message: message.trim(),
      type: type,
      role: student.role || 'student',
      reply_to: reply_to || null
    });

    await newMessage.save();

    // Populate student info for response
    await newMessage.populate('student_id', 'full_name profile_image');
    if (reply_to) {
      await newMessage.populate('reply_to', 'message student_name');
    }

    // Broadcast via Socket.io (handled by socket handler)
    // The real-time broadcasting will be handled in the socket connection

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ message: 'Xabar yuborishda xatolik yuz berdi' });
  }
});

// Add reaction to message
router.post('/messages/:messageId/reactions', authenticateStudent, async (req, res) => {
  try {
    const { emoji } = req.body;
    const { messageId } = req.params;
    const student = req.student;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji talab qilinadi' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Xabar topilmadi' });
    }

    await message.addReaction(student._id, emoji);

    res.json({ message: 'Reaksiya qo\'shildi' });
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ message: 'Reaksiya qo\'shishda xatolik' });
  }
});

// Remove reaction from message
router.delete('/messages/:messageId/reactions', authenticateStudent, async (req, res) => {
  try {
    const { messageId } = req.params;
    const student = req.student;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Xabar topilmadi' });
    }

    await message.removeReaction(student._id);

    res.json({ message: 'Reaksiya olib tashlandi' });
  } catch (error) {
    console.error('Reaction removal error:', error);
    res.status(500).json({ message: 'Reaksiyani olib tashlashda xatolik' });
  }
});

// Delete own message
router.delete('/messages/:messageId', authenticateStudent, async (req, res) => {
  try {
    const { messageId } = req.params;
    const student = req.student;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Xabar topilmadi' });
    }

    // Check if user owns the message or is admin/moderator
    if (message.student_id.toString() !== student._id.toString() && 
        !['admin', 'moderator'].includes(student.role)) {
      return res.status(403).json({ message: 'Ruxsat berilmagan' });
    }

    message.is_deleted = true;
    message.edited = true;
    await message.save();

    res.json({ message: 'Xabar o\'chirildi' });
  } catch (error) {
    console.error('Message deletion error:', error);
    res.status(500).json({ message: 'Xabarni o\'chirishda xatolik' });
  }
});

// Edit own message
router.put('/messages/:messageId', authenticateStudent, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;
    const student = req.student;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Xabar bo\'sh bo\'lishi mumkin emas' });
    }

    const messageDoc = await Message.findById(messageId);
    if (!messageDoc) {
      return res.status(404).json({ message: 'Xabar topilmadi' });
    }

    // Check if user owns the message
    if (messageDoc.student_id.toString() !== student._id.toString()) {
      return res.status(403).json({ message: 'Ruxsat berilmagan' });
    }

    // Check if message is older than 15 minutes
    const messageAge = Date.now() - new Date(messageDoc.created_at).getTime();
    if (messageAge > 15 * 60 * 1000) {
      return res.status(400).json({ message: 'Xabarni faqat 15 daqiqa ichida tahrirlash mumkin' });
    }

    messageDoc.message = message.trim();
    messageDoc.edited = true;
    await messageDoc.save();

    await messageDoc.populate('student_id', 'full_name profile_image');

    res.json(messageDoc);
  } catch (error) {
    console.error('Message edit error:', error);
    res.status(500).json({ message: 'Xabarni tahrirlashda xatolik' });
  }
});

// Get online users (from community service)
router.get('/online-users', authenticateStudent, async (req, res) => {
  try {
    const onlineUsers = communityService.getOnlineUsersList();
    
    // Get full student details for online users
    const userIds = onlineUsers.map(user => user._id);
    const students = await Student.find({ 
      _id: { $in: userIds } 
    }).select('full_name profile_image role');

    const onlineUsersWithDetails = onlineUsers.map(onlineUser => {
      const student = students.find(s => s._id.toString() === onlineUser._id);
      return {
        ...onlineUser,
        full_name: student?.full_name || 'Unknown',
        profile_image: student?.profile_image || '',
        role: student?.role || 'student'
      };
    });

    res.json(onlineUsersWithDetails);
  } catch (error) {
    console.error('Online users error:', error);
    res.status(500).json({ message: 'Online foydalanuvchilarni olishda xatolik' });
  }
});

// Get community statistics
router.get('/stats', authenticateStudent, async (req, res) => {
  try {
    const stats = {
      online_users: communityService.getOnlineUsersCount(),
      total_messages: await Message.countDocuments({ is_deleted: false }),
      active_users_today: await Message.distinct('student_id', {
        created_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        is_deleted: false
      }).then(users => users.length)
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Statistikani olishda xatolik' });
  }
});

export default router;
