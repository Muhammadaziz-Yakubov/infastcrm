import TelegramBot from 'node-telegram-bot-api';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';

// Telegram Bot configuration
const BOT_TOKEN = '8317971016:AAFQeb5Gx8ALmOiADCDYqcYRXcccZlEttcw';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5125551645';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Webhook setup
export const setupWebhook = async () => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL || 'https://infastcrm-0b2r.onrender.com/api/telegram/webhook';
    
    await bot.setWebHook(webhookUrl);
    console.log(`✅ Telegram webhook set to: ${webhookUrl}`);
    return true;
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
    return false;
  }
};

// Webhook endpoint handler
export const handleWebhook = async (req, res) => {
  try {
    const update = req.body;
    
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const chatType = msg.chat.type;
      
      console.log(`📱 Webhook message from chat ID: ${chatId} (type: ${chatType})`);
      
      // Handle /start command
      if (msg.text === '/start') {
        let responseMessage = '';
        
        if (chatType === 'private') {
          responseMessage = `🚫 <b>Xatolik!</b>

🤖 Bu bot faqat guruhda ishlaydi va siz boshqara olmaysiz!

📝 <b>Izoh:</b>
• Bot faqat InFast CRM tizimi uchun mo'ljallangan
• Guruhga avtomatik eslatmalar yuborish uchun ishlatiladi
• Shaxsiy chatlarda ishlamaydi

👥 <b>To'g'ri foydalanish:</b>
• Guruh adminiga murojaat qiling
• Botni guruhga qo'shishni so'rang
• Admin guruhni tizimga ulaydi

📚 <b>InFast CRM</b> - O'quv markazi uchun zamonaviy boshqaruv tizimi`;
        } else {
          responseMessage = `✅ <b>Bot guruhga muvaffaqiyatli qo'shildi!</b>

🤖 InFast CRM bot endi bu guruhda ishlamoqda!

📋 <b>Bot funksiyalari:</b>
• 📅 Kunlik dars eslatmalari (7:00)
• 💰 To'lov eslatmalari (12:00)  
• 📊 Davomat xulosalari (darsdan 1 soat keyin)
• 🎯 Dars ballari xabarlari

⚙️ <b>Sozlash uchun:</b>
• Guruh ma'lumotlarini InFast CRM tizimida yangilang
• Telegram Chat ID ni to'g'ri kiriting

🎉 <b>Tayyor!</b> Endi guruhga avtomatik xabarlar keladi!`;
        }
        
        await bot.sendMessage(chatId, responseMessage, {
          parse_mode: 'HTML',
          disable_web_page_preview: true
        });
      }
      
      // Log all group messages to help find new chat_id
      if (chatType !== 'private') {
        console.log(`📢 Webhook message from group chat ID: ${chatId} (type: ${chatType})`);
        console.log(`👥 Group name: ${msg.chat.title || 'No title'}`);
        console.log(`📝 Update your .env file with: TELEGRAM_CHAT_ID=${chatId}`);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error');
  }
};

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

// Handle /start command (for polling)
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  
  console.log(`📱 Message from chat ID: ${chatId} (type: ${chatType})`);
  
  let responseMessage = '';
  
  if (chatType === 'private') {
    responseMessage = `🚫 <b>Xatolik!</b>

🤖 Bu bot faqat guruhda ishlaydi va siz boshqara olmaysiz!

📝 <b>Izoh:</b>
• Bot faqat InFast CRM tizimi uchun mo'ljallangan
• Guruhga avtomatik eslatmalar yuborish uchun ishlatiladi
• Shaxsiy chatlarda ishlamaydi

👥 <b>To'g'ri foydalanish:</b>
• Guruh adminiga murojaat qiling
• Botni guruhga qo'shishni so'rang
• Admin guruhni tizimga ulaydi

📚 <b>InFast CRM</b> - O'quv markazi uchun zamonaviy boshqaruv tizimi`;
  } else {
    responseMessage = `✅ <b>Bot guruhga muvaffaqiyatli qo'shildi!</b>

🤖 InFast CRM bot endi bu guruhda ishlamoqda!

📋 <b>Bot funksiyalari:</b>
• 📅 Kunlik dars eslatmalari (7:00)
• 💰 To'lov eslatmalari (12:00)  
• 📊 Davomat xulosalari (darsdan 1 soat keyin)
• 🎯 Dars ballari xabarlari

⚙️ <b>Sozlash uchun:</b>
• Guruh ma'lumotlarini InFast CRM tizimida yangilang
• Telegram Chat ID ni to'g'ri kiriting

🎉 <b>Tayyor!</b> Endi guruhga avtomatik xabarlar keladi!`;
  }
  
  bot.sendMessage(chatId, responseMessage, {
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });
});

// Listen for any message to detect new chat_id (for polling)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  
  // Log all messages to help find new chat_id
  if (chatType !== 'private') {
    console.log(`📢 Message from group chat ID: ${chatId} (type: ${chatType})`);
    console.log(`👥 Group name: ${msg.chat.title || 'No title'}`);
    console.log(`📝 NEW CHAT_ID FOUND: ${chatId}`);
    console.log(`🔧 Update your environment variable: TELEGRAM_CHAT_ID=${chatId}`);
    
    // Auto-update CHAT_ID if it's different from current
    if (chatId !== CHAT_ID) {
      console.log(`🔄 Auto-updating CHAT_ID from ${CHAT_ID} to ${chatId}`);
      // Note: This won't persist across restarts, but helps for immediate testing
      process.env.TELEGRAM_CHAT_ID = chatId;
    }
  }
});

// Test bot connection
let connectionTested = false;
export const testBotConnection = async () => {
  if (connectionTested) return true; // Already tested
  
  try {
    const botInfo = await bot.getMe();
    console.log('🤖 Bot connected successfully:', botInfo.username);
    
    // Try to send test message, if fails due to supergroup, update chat_id
    try {
      await sendTelegramMessage('🤖 InFast CRM Bot Aktivlashitirdi va to`liq ishlamoqda ! ✅');
    } catch (error) {
      if (error.message.includes('upgraded to a supergroup')) {
        console.log('⚠️ Main group was upgraded to supergroup. Please update the main chat_id in .env file.');
        console.log('📝 Current chat_id is outdated. Get new chat_id from Telegram and update TELEGRAM_CHAT_ID in .env');
      } else {
        throw error;
      }
    }
    
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

// Get updated chat info (for supergroup upgrades)
export const getChatInfo = async (chatId) => {
  try {
    const chatInfo = await bot.getChat(chatId);
    return chatInfo;
  } catch (error) {
    console.error(`❌ Error getting chat info for ${chatId}:`, error.message);
    return null;
  }
};

// Get new chat_id for supergroup upgrade
export const getNewChatIdForSupergroup = async (oldChatId) => {
  try {
    // Try to get chat info - this might fail or return new ID
    const chatInfo = await bot.getChat(oldChatId);
    if (chatInfo && chatInfo.id !== oldChatId) {
      console.log(`🔄 New chat_id found: ${chatInfo.id} (old: ${oldChatId})`);
      return chatInfo.id.toString();
    }
    
    // If that doesn't work, we need to get the new ID manually
    console.log(`⚠️ Could not automatically get new chat_id for ${oldChatId}`);
    console.log(`📝 Please get new chat_id manually:`);
    console.log(`   1. Add bot to the upgraded group`);
    console.log(`   2. Send any message to the group`);
    console.log(`   3. Check server logs for 'message from chat ID: XXX'`);
    console.log(`   4. Update TELEGRAM_CHAT_ID in .env file`);
    
    return null;
  } catch (error) {
    console.error(`❌ Error getting new chat_id:`, error.message);
    return null;
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
    return true;
  } catch (error) {
    console.error(`❌ Error sending message to chat ${chatId}:`, error.message);
    
    // If group was upgraded to supergroup, try to get new chat_id
    if (error.message.includes('upgraded to a supergroup')) {
      console.log(`⚠️ Group ${chatId} was upgraded to supergroup. Please update the chat_id.`);
      
      // Try to get new chat info
      const chatInfo = await getChatInfo(chatId);
      if (chatInfo && chatInfo.id !== chatId) {
        console.log(`🔄 New chat_id found: ${chatInfo.id}`);
        console.log(`📝 Please update group telegram_chat_id from ${chatId} to ${chatInfo.id}`);
      }
      
      return false;
    }
    
    return false;
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

// Format attendance summary message
const formatAttendanceMessage = (group, absentStudents, presentStudents) => {
  const today = new Date().toLocaleDateString('uz-UZ');
  
  let message = `
📋 <b>DAVOMAT XULOSASI</b>

🏷️ <b>Guruh:</b> ${group.name}
📅 <b>Sana:</b> ${today}
📚 <b>Kurs:</b> ${group.course_id?.name || 'Noma\'lum'}

📊 <b>Davomat natijalari:</b>
❌ <b>Kelmaganlar:</b> ${absentStudents.length} ta
  `.trim();

  if (absentStudents.length > 0) {
    const absentList = absentStudents.map((student, index) => {
      return `${index + 1}. <b>${student.full_name}</b>
   📞 ${student.phone}`;
    }).join('\n\n');

    message += `

❌ <b>Kelmagan o'quvchilar:</b>

${absentList}`;
  } else {
    message += `

✅ <b>Barcha o'quvchilar darsga kelishgan!</b>`;
  }

  return message;
};

// Format scores message
const formatScoresMessage = (group, presentStudents) => {
  const today = new Date().toLocaleDateString('uz-UZ');
  
  let message = `
🎯 <b>BUGUNGI DARS BALLARI</b>

  `.trim();

  if (presentStudents.length > 0) {
    const scoresList = presentStudents.map((student, index) => {
      return `${index + 1}. <b>${student.full_name}</b>
   📞 ${student.phone}
   🎯 <b>Ball:</b> ${student.score || 0}`;
    }).join('\n\n');

    message += `

📝 <b>Ballar ro'yxati:</b>

${scoresList}`;
  }

  return message;
};

// Send attendance summary after 1 hour
export const sendAttendanceSummary = async (groupId, date) => {
  try {
    console.log(`📋 Starting attendance summary for group ${groupId}`);
    
    const group = await Group.findById(groupId).populate('course_id');
    if (!group) {
      console.log(`❌ Group ${groupId} not found`);
      return;
    }
    
    if (!group.telegram_chat_id) {
      console.log(`❌ Group ${group.name} has no telegram_chat_id`);
      return;
    }
    
    console.log(`📋 Found group ${group.name} with chat_id: ${group.telegram_chat_id}`);

    // Get today's attendance records
    const attendanceRecords = await Attendance.find({
      group_id: groupId,
      date: new Date(date)
    }).populate('student_id');

    // Get all students in group
    const allStudents = await Student.find({ group_id: groupId });

    // Separate present and absent students
    const presentStudents = attendanceRecords
      .filter(record => record.status === 'PRESENT')
      .map(record => ({
        ...record.student_id.toObject(),
        score: record.score || 0
      }));

    const absentStudents = allStudents.filter(student => 
      !attendanceRecords.some(record => 
        record.student_id._id.toString() === student._id.toString() && 
        record.status === 'PRESENT'
      )
    );

    // Send attendance summary (absent students)
    let currentChatId = group.telegram_chat_id;
    console.log(`📤 Attempting to send to chat_id: ${currentChatId}`);
    
    let attendanceSent = await sendTelegramMessageToChat(currentChatId, attendanceMessage);
    
    // If sending failed due to supergroup upgrade, try to update chat_id
    if (!attendanceSent) {
      console.log(`🔄 Failed to send, trying to update chat_id...`);
      const newChatId = await updateGroupChatId(group._id, currentChatId);
      if (newChatId !== currentChatId) {
        currentChatId = newChatId;
        console.log(`📤 Retrying with new chat_id: ${currentChatId}`);
        attendanceSent = await sendTelegramMessageToChat(currentChatId, attendanceMessage);
      }
    }
    
    // Send scores message (present students with scores)
    if (presentStudents.length > 0 && attendanceSent) {
      console.log(`📤 Sending scores message...`);
      const scoresMessage = formatScoresMessage(group, presentStudents);
      await sendTelegramMessageToChat(currentChatId, scoresMessage);
    }
    
    console.log(`✅ Attendance summary and scores sent to group ${group.name}`);
  } catch (error) {
    console.error('Error sending attendance summary:', error);
  }
};

// Update group chat_id if group was upgraded to supergroup
export const updateGroupChatId = async (groupId, oldChatId) => {
  try {
    const chatInfo = await getChatInfo(oldChatId);
    if (chatInfo && chatInfo.id !== oldChatId) {
      // Update the group with new chat_id
      await Group.findByIdAndUpdate(groupId, { 
        telegram_chat_id: chatInfo.id.toString() 
      });
      console.log(`✅ Updated group ${groupId} chat_id from ${oldChatId} to ${chatInfo.id}`);
      return chatInfo.id;
    }
    return oldChatId;
  } catch (error) {
    console.error(`❌ Error updating group chat_id:`, error.message);
    return oldChatId;
  }
};

export default {
  sendPaymentNotification,
  sendDailyReminders,
  sendPaymentDueReminder,
  sendClassReminder,
  sendAllClassReminders,
  sendAttendanceSummary,
  getChatInfo,
  updateGroupChatId,
  testBotConnection
};
