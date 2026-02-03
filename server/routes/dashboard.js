import express from 'express';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import Lead from '../models/Lead.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalGroups,
      activeGroups,
      totalRevenue,
      thisMonthRevenue,
      totalLeads,
      newLeads
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'ACTIVE' }),
      Group.countDocuments(),
      Group.countDocuments({ status: 'ACTIVE' }),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([
        {
          $match: {
            payment_date: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Lead.countDocuments(),
      Lead.countDocuments({
        created_at: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);

    res.json({
      totalStudents,
      activeStudents,
      totalGroups,
      activeGroups,
      totalRevenue: totalRevenue[0]?.total || 0,
      thisMonthRevenue: thisMonthRevenue[0]?.total || 0,
      totalLeads,
      newLeads
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get recent activities
router.get('/recent-activities', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [recentStudents, recentPayments, recentAttendance] = await Promise.all([
      Student.find()
        .sort({ createdAt: -1 })
        .limit(Math.ceil(limit / 3))
        .populate('group_id', 'name')
        .select('full_name phone status group_id createdAt'),
      Payment.find()
        .sort({ payment_date: -1 })
        .limit(Math.ceil(limit / 3))
        .populate('student_id', 'full_name')
        .populate('group_id', 'name')
        .select('amount payment_date student_id group_id type'),
      Attendance.find()
        .sort({ date: -1 })
        .limit(Math.ceil(limit / 3))
        .populate('student_id', 'full_name')
        .populate('group_id', 'name')
        .select('date status student_id group_id')
    ]);

    const activities = [
      ...recentStudents.map(student => ({
        type: 'student',
        title: `Yangi o'quvchi: ${student.full_name}`,
        description: `Guruh: ${student.group_id?.name || 'Noma\'lum'}`,
        time: student.createdAt,
        data: student
      })),
      ...recentPayments.map(payment => ({
        type: 'payment',
        title: `To'lov: ${payment.amount} so'm`,
        description: `${payment.student_id?.full_name} - ${payment.group_id?.name || 'Noma\'lum'}`,
        time: payment.payment_date,
        data: payment
      })),
      ...recentAttendance.map(attendance => ({
        type: 'attendance',
        title: `Davomat: ${attendance.status === 'PRESENT' ? 'Keldi' : 'Kelmadi'}`,
        description: `${attendance.student_id?.full_name} - ${attendance.group_id?.name || 'Noma\'lum'}`,
        time: attendance.date,
        data: attendance
      }))
    ];

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(activities.slice(0, limit));
  } catch (error) {
    console.error('❌ Recent activities error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming events/reminders
router.get('/upcoming', authenticate, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7);

    const [upcomingPayments, upcomingBirthdays] = await Promise.all([
      Student.find({
        status: 'ACTIVE',
        next_payment_date: {
          $gte: today,
          $lte: tomorrow
        }
      })
        .populate('group_id', 'name')
        .select('full_name next_payment_date group_id')
        .sort({ next_payment_date: 1 }),
      Student.find({
        status: 'ACTIVE',
        birth_date: {
          $gte: today,
          $lte: tomorrow
        }
      })
        .populate('group_id', 'name')
        .select('full_name birth_date group_id')
        .sort({ birth_date: 1 })
    ]);

    res.json({
      upcomingPayments,
      upcomingBirthdays
    });
  } catch (error) {
    console.error('❌ Upcoming events error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
