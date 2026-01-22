import Student from '../models/Student.js';
import SmsLog from '../models/SmsLog.js';
import { sendSms } from '../services/smsService.js';

const getStartOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getEndOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

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

export const sendDebtorSmsReminders = async () => {
  try {
    const today = new Date();
    const start = getStartOfDay(today);
    const end = getEndOfDay(today);

    const debtors = await Student.find({
      status: 'DEBTOR',
      next_payment_date: { $lt: start }
    }).populate({
      path: 'group_id',
      populate: { path: 'course_id' }
    });

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const student of debtors) {
      const phone = student.phone;
      if (!phone) {
        skipped += 1;
        continue;
      }

      const alreadySent = await SmsLog.findOne({
        type: 'DEBTOR_DAILY_REMINDER',
        student_id: student._id,
        status: 'SUCCESS',
        createdAt: { $gte: start, $lte: end }
      });

      if (alreadySent) {
        skipped += 1;
        continue;
      }

      const debt = calculateDebt(student);
      const text = `Hurmatli ${student.full_name}! Sizning qarzingiz ${formatMoney(debt)} so'm. To'lov qiling bo'lmasa darsga kiritilmaysiz. InFast IT-Academy`;

      try {
        const result = await sendSms({
          phone,
          message: text,
          studentId: student._id,
          type: 'DEBTOR_DAILY_REMINDER'
        });

        if (result.success) {
          sent += 1;
        } else {
          failed += 1;
        }
      } catch (e) {
        failed += 1;
        await SmsLog.create({
          provider: 'DEVSMS',
          type: 'DEBTOR_DAILY_REMINDER',
          student_id: student._id,
          phone: String(phone),
          message: text,
          status: 'FAILED',
          provider_error: e.message
        });
      }
    }

    console.log(`📩 Debtor SMS job finished. debtors=${debtors.length} sent=${sent} skipped=${skipped} failed=${failed}`);
  } catch (error) {
    console.error('❌ Error in debtor SMS job:', error);
  }
};
