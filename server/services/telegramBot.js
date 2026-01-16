import TelegramBot from 'node-telegram-bot-api';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';

// Telegram Bot configuration
const BOT_TOKEN = '8317971016:AAFQeb5Gx8ALmOiADCDYqcYRXcccZlEttcw';
const CHAT_ID = '-5125551645';

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Send message to Telegram group
const sendTelegramMessage = async (message) => {
  try {
    await bot.sendMessage(CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    console.log('✅ Telegram message sent successfully');
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error.message);
  }
};

// Format payment message
const formatPaymentMessage = (student, payment) => {
  const paymentTypeLabels = {
    'CASH': 'Naqd pul',
    'CARD': 'Plastik karta',
    'CLICK': 'Click',
    'PAYME': 'Payme'
  };

  return `
🎉 <b>YANGI TO'LOV QILINDI!</b>

👤 <b>O'quvchi:</b> ${student.full_name}
📞 <b>Telefon:</b> ${student.phone}
📚 <b>Guruh:</b> ${student.group_id?.name || 'Noma\'lum'}
💰 <b>Summa:</b> ${payment.amount.toLocaleString()} so'm
💳 <b>To'lov turi:</b> ${paymentTypeLabels[payment.payment_type] || payment.payment_type}
📅 <b>Sana:</b> ${new Date(payment.payment_date).toLocaleDateString('uz-UZ')}
📝 <b>Izoh:</b> ${payment.note || 'Izoh yo\'q'}

✅ To'lov muvaffaqiyatli qabul qilindi!
  `.trim();
};

// Format daily reminder message
const formatDailyReminderMessage = (students) => {
  if (students.length === 0) {
    return `
📅 <b>KUNLIK TO'LOV ESLATMASI</b>

✅ Bugun to'lov qilishi kerak bo'lgan o'quvchilar yo'q!

🎉 Barcha o'quvchilar to'lovlarini vaqtida amalga oshirishgan!
    `.trim();
  }

  const studentList = students.map((student, index) => {
    const daysUntilPayment = Math.ceil((new Date(student.next_payment_date) - new Date()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntilPayment <= 0 ? '🔴' : daysUntilPayment <= 3 ? '🟡' : '🟢';
    
    return `${index + 1}. ${urgency} <b>${student.full_name}</b>
   📞 ${student.phone}
   📚 ${student.group_id?.name || 'Noma\'lum'}
   💰 To'lov sanasi: ${new Date(student.next_payment_date).toLocaleDateString('uz-UZ')}
   ⏰ Qolgan kunlar: ${daysUntilPayment <= 0 ? 'Muddati o\'tgan!' : `${daysUntilPayment} kun`}`;
  }).join('\n\n');

  return `
📅 <b>KUNLIK TO'LOV ESLATMASI</b>

🔔 Bugun to'lov qilishi kerak bo'lgan o'quvchilar:

${studentList}

⚠️ Iltimos, o'quvchilarga to'lov haqida eslatma bering!
  `.trim();
};

// Format payment due reminder
const formatPaymentDueMessage = (student) => {
  const daysUntilPayment = Math.ceil((new Date(student.next_payment_date) - new Date()) / (1000 * 60 * 60 * 24));
  
  return `
⚠️ <b>TO'LOV ESLATMASI!</b>

👤 <b>O'quvchi:</b> ${student.full_name}
📞 <b>Telefon:</b> ${student.phone}
📚 <b>Guruh:</b> ${student.group_id?.name || 'Noma\'lum'}
💰 <b>To'lov sanasi:</b> ${new Date(student.next_payment_date).toLocaleDateString('uz-UZ')}
⏰ <b>Qolgan kunlar:</b> ${daysUntilPayment <= 0 ? 'Muddati o\'tgan!' : `${daysUntilPayment} kun`}

🔔 Iltimos, o'quvchiga to'lov to'g'risida eslatma bering!
  `.trim();
};

// Send payment notification
export const sendPaymentNotification = async (studentId, paymentData) => {
  try {
    const student = await Student.findById(studentId).populate('group_id');
    if (!student) return;

    const message = formatPaymentMessage(student, paymentData);
    await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending payment notification:', error);
  }
};

// Send daily payment reminders (12:00)
export const sendDailyReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get students with payments due today or tomorrow
    const students = await Student.find({
      status: { $in: ['ACTIVE', 'DEBTOR'] },
      next_payment_date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('group_id');

    const message = formatDailyReminderMessage(students);
    await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending daily reminders:', error);
  }
};

// Send payment due reminder for specific student
export const sendPaymentDueReminder = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate('group_id');
    if (!student) return;

    const message = formatPaymentDueMessage(student);
    await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending payment due reminder:', error);
  }
};

// Test bot connection
let connectionTested = false;
export const testBotConnection = async () => {
  if (connectionTested) return true; // Already tested
  
  try {
    const botInfo = await bot.getMe();
    console.log('🤖 Bot connected successfully:', botInfo.username);
    
    await sendTelegramMessage('🤖 InFast CRM Bot Aktivlashitirdi va to`liq ishlamoqda ! ✅');
    connectionTested = true;
    return true;
  } catch (error) {
    console.error('❌ Bot connection failed:', error.message);
    return false;
  }
};

// Format class reminder message
const formatClassReminderMessage = (group, debtorStudents) => {
  const dayNames = {
    'Mon': 'Dushanba',
    'Tue': 'Seshanba', 
    'Wed': 'Chorshanba',
    'Thu': 'Payshanba',
    'Fri': 'Juma',
    'Sat': 'Shanba',
    'Sun': 'Yakshanba'
  };

  const daysText = group.days_of_week.map(day => dayNames[day]).join(', ');

  let message = `
📚 <b>DARS ESLATMASI</b>

🏷️ <b>Guruh:</b> ${group.name}
📅 <b>Kunlar:</b> ${daysText}
⏰ <b>Vaqt:</b> ${group.time}

📅 <b>Bugun darsimiz bor!</b>
  `.trim();

  if (debtorStudents.length > 0) {
    const debtorList = debtorStudents.map((student, index) => {
      return `${index + 1}. <b>${student.full_name}</b>
   📞 ${student.phone}
   💰 To'lov sanasi: ${new Date(student.next_payment_date).toLocaleDateString('uz-UZ')}`;
    }).join('\n\n');

    message += `

⚠️ <b>Qarzdor o'quvchilar:</b>

${debtorList}

🔔 Iltimos, ushbu o'quvchilar to'lovni qiling agarda tolov qilinmasa darsga kira olmaysiz !`;
  }
  return message;
};

// Send class reminder to specific group
export const sendClassReminder = async (groupId) => {
  try {
    const group = await Group.findById(groupId).populate('course_id');
    if (!group || !group.telegram_chat_id) return;

    // Get debtor students in this group
    const debtorStudents = await Student.find({
      group_id: groupId,
      status: 'DEBTOR'
    });

    const message = formatClassReminderMessage(group, debtorStudents);
    await sendTelegramMessageToChat(group.telegram_chat_id, message);
  } catch (error) {
    console.error('Error sending class reminder:', error);
  }
};

// Send message to specific chat
export const sendTelegramMessageToChat = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    console.log(`✅ Message sent to chat ${chatId}`);
  } catch (error) {
    console.error(`❌ Error sending message to chat ${chatId}:`, error.message);
  }
};

// Send class reminders for all groups (runs at 7:00 AM)
export const sendAllClassReminders = async () => {
  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    // Get groups that have class today
    const groupsToday = await Group.find({
      days_of_week: today,
      status: 'ACTIVE',
      telegram_chat_id: { $ne: '' }
    }).populate('course_id');

    console.log(`📚 Found ${groupsToday.length} groups with classes today`);

    for (const group of groupsToday) {
      await sendClassReminder(group._id);
    }
  } catch (error) {
    console.error('Error sending all class reminders:', error);
  }
};

export default {
  sendPaymentNotification,
  sendDailyReminders,
  sendPaymentDueReminder,
  sendClassReminder,
  sendAllClassReminders,
  testBotConnection
};
