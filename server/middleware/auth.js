import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Kirish talab etiladi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    }
    if (user.status === 'INACTIVE') {
      return res.status(401).json({ message: 'Hisobingiz faol emas' });
    }

    req.user = { ...decoded, role: user.role, _id: user._id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token yaroqsiz' });
  }
};

// Middleware for admin only routes
export const requireAdmin = (req, res, next) => {
  console.log(`🔐 Checking admin access for user:`, req.user ? {
    id: req.user._id,
    role: req.user.role,
    email: req.user.email
  } : 'no user');

  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({ message: 'Autentifikatsiya talab etiladi' });
  }

  if (req.user.role !== 'ADMIN') {
    console.log(`❌ User ${req.user._id} has role ${req.user.role}, admin required`);
    return res.status(403).json({ message: 'Admin huquqi talab etiladi' });
  }

  console.log(`✅ Admin access granted for user ${req.user._id}`);
  next();
};

// Middleware for manager or admin routes
export const requireManagerOrAdmin = (req, res, next) => {
  if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Ruxsat berilmagan' });
  }
  next();
};

// Middleware for student authentication
export const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Kirish talab etiladi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check token type
    if (decoded.type !== 'student') {
      return res.status(401).json({ message: 'Noto\'g\'ri token turi' });
    }
    
    // Check if student still exists and is active
    const student = await Student.findById(decoded.studentId).populate({
      path: 'group_id',
      populate: { path: 'course_id' }
    });
    if (!student) {
      return res.status(401).json({ message: 'O\'quvchi topilmadi' });
    }
    if (student.status === 'STOPPED') {
      return res.status(401).json({ message: 'Hisobingiz faol emas' });
    }

    req.student = student;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token yaroqsiz' });
  }
};

