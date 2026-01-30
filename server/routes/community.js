import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Student from '../models/Student.js';

const router = express.Router();

// Mock messages data (real implementation would use Socket.io or WebSocket)
let messages = [
  {
    id: 1,
    student_id: '64f1234567890abcdef12345',
    student_name: 'Ali Valiyev',
    message: 'Assalomu alaykum hammaga! 🎉',
    role: 'student',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    student_id: '64f1234567890abcdef12346',
    student_name: 'Admin',
    message: 'InFast IT ga xush kelibsiz! 💻',
    role: 'admin',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    student_id: '64f1234567890abcdef12347',
    student_name: 'Dilnoza Karimova',
    message: 'Bugun dars juda zo\'r edi! 🔥',
    role: 'vip',
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

// Get all messages
router.get('/messages', authenticate, async (req, res) => {
  try {
    // Sort by created_at descending (newest first)
    const sortedMessages = messages.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    res.json(sortedMessages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
});

// Send new message
router.post('/messages', authenticate, async (req, res) => {
  try {
    const { message, type = 'text' } = req.body;
    const student = req.student;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Xabar bo\'sh bo\'lishi mumkin emas' });
    }

    const newMessage = {
      id: messages.length + 1,
      student_id: student._id,
      student_name: student.full_name,
      message: message.trim(),
      role: student.role || 'student',
      type: type,
      created_at: new Date().toISOString()
    };

    messages.unshift(newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ message: 'Xabar yuborishda xatolik yuz berdi' });
  }
});

// Get online users (mock data)
router.get('/online-users', authenticate, async (req, res) => {
  try {
    // Mock online users - in real implementation, this would track actual online status
    const onlineUsers = [
      { _id: '64f1234567890abcdef12345', full_name: 'Ali Valiyev', role: 'student' },
      { _id: '64f1234567890abcdef12346', full_name: 'Admin', role: 'admin' },
      { _id: '64f1234567890abcdef12347', full_name: 'Dilnoza Karimova', role: 'vip' },
      { _id: '64f1234567890abcdef12348', full_name: 'Botirjon Umarov', role: 'student' },
      { _id: '64f1234567890abcdef12349', full_name: 'Moderator', role: 'moderator' }
    ];

    res.json(onlineUsers);
  } catch (error) {
    console.error('Online users error:', error);
    res.status(500).json({ message: 'Online foydalanuvchilarni olishda xatolik' });
  }
});

export default router;
