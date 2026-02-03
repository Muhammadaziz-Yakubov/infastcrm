import express from 'express';
import SmsLog from '../models/SmsLog.js';
import Student from '../models/Student.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getBalance, sendSms } from '../services/smsService.js';

const router = express.Router();

router.get('/balance', authenticate, requireAdmin, async (req, res) => {
  try {
    const balance = await getBalance();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/logs', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_id, status, type, limit = 50, offset = 0 } = req.query;
    const filter = {};
    if (student_id) filter.student_id = student_id;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const logs = await SmsLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(offset) || 0)
      .limit(Math.min(Number(limit) || 50, 200))
      .populate('student_id', 'full_name phone');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send/test', authenticate, requireAdmin, async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ message: 'phone and message are required' });
    }

    const result = await sendSms({
      phone,
      message,
      type: 'MANUAL_TEST'
    });

    res.json({
      success: result.success,
      log: result.log
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send/students', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_ids, message } = req.body;
    if (!Array.isArray(student_ids) || student_ids.length === 0 || !message) {
      return res.status(400).json({ message: 'student_ids (array) and message are required' });
    }

    const students = await Student.find({ _id: { $in: student_ids } });

    let sent = 0;
    let failed = 0;
    const logs = [];

    for (const student of students) {
      try {
        const r = await sendSms({
          phone: student.phone,
          message,
          studentId: student._id,
          type: 'MANUAL_STUDENT'
        });
        logs.push(r.log);
        if (r.success) sent += 1;
        else failed += 1;
      } catch (e) {
        failed += 1;
        const log = await SmsLog.create({
          provider: 'DEVSMS',
          type: 'MANUAL_STUDENT',
          student_id: student._id,
          phone: String(student.phone || ''),
          message,
          status: 'FAILED',
          provider_error: e.message
        });
        logs.push(log);
      }
    }

    res.json({
      success: true,
      targets: students.length,
      sent,
      failed,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send/group', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, message, statuses } = req.body;
    if (!group_id || !message) {
      return res.status(400).json({ message: 'group_id and message are required' });
    }

    const filter = { group_id };
    if (Array.isArray(statuses) && statuses.length > 0) {
      filter.status = { $in: statuses };
    }

    const students = await Student.find(filter);

    let sent = 0;
    let failed = 0;
    const logs = [];

    for (const student of students) {
      try {
        const r = await sendSms({
          phone: student.phone,
          message,
          studentId: student._id,
          type: 'MANUAL_GROUP'
        });
        logs.push(r.log);
        if (r.success) sent += 1;
        else failed += 1;
      } catch (e) {
        failed += 1;
        const log = await SmsLog.create({
          provider: 'DEVSMS',
          type: 'MANUAL_GROUP',
          student_id: student._id,
          phone: String(student.phone || ''),
          message,
          status: 'FAILED',
          provider_error: e.message
        });
        logs.push(log);
      }
    }

    res.json({
      success: true,
      targets: students.length,
      sent,
      failed,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send/all-groups', authenticate, requireAdmin, async (req, res) => {
  try {
    const { message, statuses } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    const filter = {};
    if (Array.isArray(statuses) && statuses.length > 0) {
      filter.status = { $in: statuses };
    }

    const students = await Student.find(filter);

    let sent = 0;
    let failed = 0;
    const logs = [];

    for (const student of students) {
      try {
        const r = await sendSms({
          phone: student.phone,
          message,
          studentId: student._id,
          type: 'MANUAL_ALL_GROUPS'
        });
        logs.push(r.log);
        if (r.success) sent += 1;
        else failed += 1;
      } catch (e) {
        failed += 1;
        const log = await SmsLog.create({
          provider: 'DEVSMS',
          type: 'MANUAL_ALL_GROUPS',
          student_id: student._id,
          phone: String(student.phone || ''),
          message,
          status: 'FAILED',
          provider_error: e.message
        });
        logs.push(log);
      }
    }

    res.json({
      success: true,
      targets: students.length,
      sent,
      failed,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/send/debtors', authenticate, requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'message is required' });
    }

    const students = await Student.find({ status: 'DEBTOR' }).populate({
      path: 'group_id',
      populate: { path: 'course_id' }
    });

    const monthsBetween = (from, to) => {
      const start = new Date(from);
      const end = new Date(to);
      let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (end.getDate() < start.getDate()) months -= 1;
      return Math.max(0, months);
    };

    const calculateDebt = (student) => {
      const monthly = student?.group_id?.course_id?.monthly_price;
      if (!monthly || !student?.next_payment_date) return 0;
      const today = new Date();
      const overdueMonths = Math.max(1, monthsBetween(student.next_payment_date, today));
      return overdueMonths * monthly;
    };

    const formatMoney = (amount) => {
      const num = Number(amount) || 0;
      const fixed = num.toFixed(2);
      const [intPart, fracPart] = fixed.split('.');
      const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return `${grouped}.${fracPart}`;
    };

    let sent = 0;
    let failed = 0;
    const logs = [];

    for (const student of students) {
      if (!student.phone) {
        failed += 1;
        continue;
      }

      const debt = calculateDebt(student);
      console.log(`👤 Student: ${student.full_name}, Phone: ${student.phone}, Debt: ${formatMoney(debt)}`);
      const personalizedMessage = message
        .replace(/{full_name}/g, student.full_name || 'O\'quvchi')
        .replace(/{debt}/g, formatMoney(debt));

      console.log(`📩 Message: ${personalizedMessage}`);

      try {
        const r = await sendSms({
          phone: student.phone,
          message: personalizedMessage,
          studentId: student._id,
          type: 'MANUAL_DEBTORS'
        });
        logs.push(r.log);
        if (r.success) sent += 1;
        else failed += 1;
      } catch (e) {
        failed += 1;
        const log = await SmsLog.create({
          provider: 'DEVSMS',
          type: 'MANUAL_DEBTORS',
          student_id: student._id,
          phone: String(student.phone || ''),
          message: personalizedMessage,
          status: 'FAILED',
          provider_error: e.message
        });
        logs.push(log);
      }
    }

    res.json({
      success: true,
      targets: students.length,
      sent,
      failed,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
