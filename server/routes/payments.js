import express from 'express';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { authenticate } from '../middleware/auth.js';
<<<<<<< HEAD
import { sendPaymentNotification } from '../services/telegramBot.js';
import ReferralService from '../services/ReferralService.js';
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

const router = express.Router();

// Get all payments
router.get('/', authenticate, async (req, res) => {
  try {
<<<<<<< HEAD
    const { student_id, start_date, end_date, month, year } = req.query;
    console.log('🔍 Payments query params:', { student_id, month, year, start_date, end_date });
    
    const filter = {};
    if (student_id) filter.student_id = student_id;
    
    if (month && year) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      filter.payment_date = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
      console.log(`📅 Filtering payments for ${year}-${month}: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);
    } else if (start_date || end_date) {
=======
    const { student_id, start_date, end_date } = req.query;
    const filter = {};
    if (student_id) filter.student_id = student_id;
    if (start_date || end_date) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      filter.payment_date = {};
      if (start_date) filter.payment_date.$gte = new Date(start_date);
      if (end_date) filter.payment_date.$lte = new Date(end_date);
    }

    const payments = await Payment.find(filter)
      .populate({
        path: 'student_id',
        populate: { path: 'group_id' }
      })
      .sort({ payment_date: -1 });
<<<<<<< HEAD
    
    console.log(`📊 Found ${payments.length} payments`);
    res.json(payments);
  } catch (error) {
    console.error('❌ Payments error:', error);
=======
    res.json(payments);
  } catch (error) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(500).json({ message: error.message });
  }
});

// Get single payment
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'student_id',
        populate: { path: 'group_id' }
      });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create payment
router.post('/', authenticate, async (req, res) => {
  try {
<<<<<<< HEAD
    let paymentAmount = req.body.amount;
    let discountInfo = null;

    const student = await Student.findById(req.body.student_id);
    if (!student) {
      return res.status(404).json({ message: 'Talaba topilmadi' });
    }

    const discountResult = await ReferralService.calculateReferrerDiscount(
      req.body.student_id,
      paymentAmount
    );

    if (discountResult.hasDiscount) {
      paymentAmount = paymentAmount - discountResult.discountAmount;
      discountInfo = {
        originalAmount: req.body.amount,
        discountAmount: discountResult.discountAmount,
        discountPercent: discountResult.discountPercent,
        finalAmount: paymentAmount,
        activeReferralsCount: discountResult.activeReferralsCount
      };
    }

    const payment = new Payment({
      ...req.body,
      amount: paymentAmount,
      discount_applied: discountResult.hasDiscount,
      discount_info: discountInfo
    });
    await payment.save();

    const friendReferralResult = await ReferralService.handleFriendFirstPayment(
      req.body.student_id,
      req.body.amount
    );

=======
    const payment = new Payment(req.body);
    await payment.save();

    // Update student payment dates and status
    const student = await Student.findById(payment.student_id);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    if (student) {
      const paymentDate = new Date(payment.payment_date);
      student.last_payment_date = paymentDate;
      
<<<<<<< HEAD
      const paymentDay = paymentDate.getDate();
      const nextPaymentDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, paymentDay);

      if (nextPaymentDate.getDate() !== paymentDay) {
        const targetYear = paymentDate.getFullYear();
        const targetMonth = paymentDate.getMonth() + 1;
        nextPaymentDate.setFullYear(targetYear, targetMonth + 1, 0);
      }

      student.next_payment_date = nextPaymentDate;
=======
      // Calculate next payment date (1 month later)
      const nextPaymentDate = new Date(paymentDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      student.next_payment_date = nextPaymentDate;
      
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      student.status = 'ACTIVE';
      await student.save();
    }

    await payment.populate({
      path: 'student_id',
      populate: { path: 'group_id' }
    });
<<<<<<< HEAD

    await sendPaymentNotification(payment.student_id._id, payment);

    res.status(201).json({
      payment,
      discountInfo,
      referralActivated: friendReferralResult ? true : false,
      referralMessage: friendReferralResult?.message
    });
=======
    res.status(201).json(payment);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update payment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'student_id',
        populate: { path: 'group_id' }
      });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Recalculate student payment dates if payment_date changed
    if (req.body.payment_date) {
      const student = await Student.findById(payment.student_id);
      if (student) {
        const paymentDate = new Date(payment.payment_date);
        student.last_payment_date = paymentDate;
<<<<<<< HEAD

        // Calculate next payment date (same day next month)
        const paymentDay = paymentDate.getDate();
        const nextPaymentDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, paymentDay);

        // If the calculated date is not the expected day (due to month length differences),
        // it means we went to the next month but landed on a different day
        // In this case, use the last day of the target month
        if (nextPaymentDate.getDate() !== paymentDay) {
          // We went past the end of the month, so use the last day of the target month
          const targetYear = paymentDate.getFullYear();
          const targetMonth = paymentDate.getMonth() + 1;
          nextPaymentDate.setFullYear(targetYear, targetMonth + 1, 0); // Last day of target month
        }

=======
        const nextPaymentDate = new Date(paymentDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        student.next_payment_date = nextPaymentDate;
        await student.save();
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete payment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

