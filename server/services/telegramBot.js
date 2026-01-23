import TelegramBot from 'node-telegram-bot-api';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';

// Telegram Bot configuration - use environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8317971016:AAFQeb5Gx8ALmOiADCDYqcYRXcccZlEttcw';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5125551645';

// Initialize bot - we'll manage polling/webhook manually
const bot = new TelegramBot(BOT_TOKEN, {
  polling: false  // Start without polling, we'll enable it if needed
});

// Add event listeners for debugging
bot.on('polling_error', (error) => {
  console.error('🚨 Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.error('🚨 Webhook error:', error);
});

bot.on('message', (msg) => {
  console.log('📨 Bot received message:', {
    chat_id: msg.chat.id,
    chat_type: msg.chat.type,
    text: msg.text ? msg.text.substring(0, 50) + '...' : 'no text',
    from: msg.from ? msg.from.username || msg.from.first_name : 'unknown'
  });
});

bot.on('callback_query', (query) => {
  console.log('🔘 Bot received callback query:', {
    id: query.id,
    data: query.data,
    from: query.from.username || query.from.first_name
  });
});

// Function to start polling as fallback (only for development)
export const startPolling = async () => {
  try {
    console.log('🔄 Starting Telegram polling...');

    // Check if we're in production - polling can cause conflicts
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Attempting to start polling in production - this may cause conflicts!');
      console.warn('🔄 In production, webhooks should be used instead of polling');
    }

    // Check if bot is already polling
    if (bot.isPolling()) {
      console.log('ℹ️ Bot is already polling, skipping...');
      return true;
    }

    // Test polling first to avoid conflicts
    try {
      console.log('🧪 Testing polling connection...');
      const testUpdates = await bot.getUpdates({ offset: -1, limit: 1, timeout: 1 });
      console.log(`📊 Polling test successful, received ${testUpdates.length} updates`);
    } catch (testError) {
      if (testError.response?.statusCode === 409) {
        console.error('❌ Polling conflict detected: Another bot instance is already running');
        console.error('🔄 In production, make sure only one instance runs, or use webhooks');
        return false;
      }
      console.warn('⚠️ Polling test failed, but continuing:', testError.message);
    }

    // Start polling
    bot.startPolling({
      restart: true,
      polling: {
        interval: 300, // Poll every 300ms
        timeout: 10,   // Timeout after 10 seconds
        limit: 100,    // Get up to 100 updates at once
        allowed_updates: ['message', 'callback_query']
      }
    });

    // Wait a moment to ensure polling starts
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (bot.isPolling()) {
      console.log('✅ Telegram polling started successfully');
      return true;
    } else {
      console.log('⚠️ Polling may not have started properly');
      return false;
    }
  } catch (error) {
    console.error('❌ Error starting polling:', error.message);
    console.error('Full polling error:', error);
    return false;
  }
};

// Webhook setup with retry logic
export const setupWebhook = async (retries = 3) => {
  const webhookUrl = process.env.WEBHOOK_URL || 'https://infastcrm-0b2r.onrender.com/api/telegram/webhook';
  console.log(`🔄 Attempting to set webhook to: ${webhookUrl}`);

  // First, test if the webhook URL is accessible
  console.log('🧪 Testing webhook URL accessibility...');
  try {
    const https = await import('https');
    const url = new URL(webhookUrl.replace('/webhook', '/webhook-test'));

    const testResponse = await new Promise((resolve, reject) => {
      const req = https.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ statusCode: res.statusCode, data: jsonData });
          } catch (e) {
            resolve({ statusCode: res.statusCode, data: null });
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });

    if (testResponse.statusCode === 200) {
      console.log('✅ Webhook URL is accessible');
    } else {
      console.error(`❌ Webhook URL returned status ${testResponse.statusCode}`);
      console.error('🔍 Make sure your webhook endpoint is publicly accessible');
      return false;
    }
  } catch (error) {
    console.error('❌ Webhook URL test failed:', error.message);
    console.error('🔍 Make sure your Render app is running and accessible');
    return false;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Webhook setup attempt ${attempt}/${retries}`);

      // First, check current webhook status
      const initialInfo = await bot.getWebHookInfo();
      console.log(`📊 Initial webhook status:`, {
        url: initialInfo.url || 'none',
        pending_updates: initialInfo.pending_update_count,
        last_error: initialInfo.last_error_message
      });

      // Delete any existing webhook first
      try {
        await bot.deleteWebHook();
        console.log('🧹 Existing webhook deleted');
      } catch (deleteError) {
        console.log('⚠️ Could not delete existing webhook:', deleteError.message);
      }

      // Wait a bit after deleting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set new webhook with certificate parameter (even though we don't have one)
      const setWebhookResult = await bot.setWebHook(webhookUrl, {
        max_connections: 100,
        allowed_updates: ['message', 'callback_query']
      });
      console.log(`📤 setWebHook result:`, setWebhookResult);

      // Wait longer for webhook to propagate
      console.log('⏳ Waiting for webhook propagation...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verify webhook was set - try multiple times
      let verificationSuccess = false;
      for (let verifyAttempt = 1; verifyAttempt <= 3; verifyAttempt++) {
        try {
          const webhookInfo = await bot.getWebHookInfo();
          console.log(`🔍 Verification attempt ${verifyAttempt}:`, {
            url: webhookInfo.url || 'empty',
            has_custom_certificate: webhookInfo.has_custom_certificate,
            pending_update_count: webhookInfo.pending_update_count,
            last_error_date: webhookInfo.last_error_date,
            last_error_message: webhookInfo.last_error_message
          });

          if (webhookInfo.url === webhookUrl) {
            console.log('✅ Webhook verification successful!');
            verificationSuccess = true;
            break;
          } else if (webhookInfo.url && webhookInfo.url !== webhookUrl) {
            console.log(`⚠️ Webhook URL mismatch. Expected: ${webhookUrl}, Got: ${webhookInfo.url}`);
          } else {
            console.log(`⚠️ Webhook URL is empty, retrying verification...`);
          }
        } catch (verifyError) {
          console.error(`❌ Verification attempt ${verifyAttempt} failed:`, verifyError.message);
        }

        if (!verificationSuccess && verifyAttempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (verificationSuccess) {
        return true;
      }

      console.log(`❌ Attempt ${attempt} failed, ${retries - attempt} attempts remaining`);

    } catch (error) {
      console.error(`❌ Webhook setup attempt ${attempt} failed:`, error.message);
      console.error('Full error details:', error);

      // If it's a network error or rate limit, wait longer before retry
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.response?.status === 429) {
        console.log('🌐 Network issue detected, waiting longer before retry...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Wait between attempts
    if (attempt < retries) {
      console.log(`⏳ Waiting before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.error(`❌ All ${retries} webhook setup attempts failed`);
  return false;
};

// Webhook endpoint handler
export const handleWebhook = async (req, res) => {
  try {
    console.log('🔗 Webhook received at:', new Date().toISOString());
    console.log('📊 Request details:', {
      method: req.method,
      url: req.url,
      contentType: req.headers['content-type'],
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      bodySize: JSON.stringify(req.body || {}).length
    });

    // Log if this is from Telegram
    if (req.headers['user-agent'] && req.headers['user-agent'].includes('Telegram')) {
      console.log('✅ Request confirmed from Telegram');
    }

    const update = req.body;

    if (!update) {
      console.log('❌ No update in webhook request body');
      return res.status(400).send('No update');
    }

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

        try {
          await bot.sendMessage(chatId, responseMessage, {
            parse_mode: 'HTML',
            disable_web_page_preview: true
          });
          console.log('✅ Response sent to chat:', chatId);
        } catch (sendError) {
          console.error('❌ Error sending message:', sendError);
        }
      }

      // Log all group messages to help find new chat_id
      if (chatType !== 'private') {
        console.log(`📢 Webhook message from group chat ID: ${chatId} (type: ${chatType})`);
        console.log(`👥 Group name: ${msg.chat.title || 'No title'}`);
        console.log(`📝 Update your .env file with: TELEGRAM_CHAT_ID=${chatId}`);
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error('Full error:', error.stack);
    // Still return 200 to prevent Telegram from retrying
    res.status(200).send('OK');
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
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000); // 10 second timeout
    });

    const botInfo = await Promise.race([
      bot.getMe(),
      timeoutPromise
    ]);
    
    console.log('🤖 Bot connected successfully:', botInfo.username);

    // Try to send test message, if fails due to supergroup, update chat_id
    try {
      // await sendTelegramMessage('🤖 InFast CRM Bot Aktivlashitirdi va to`liq ishlamoqda ! ✅');
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
    console.log(`📤 Attempting to send message to chat ${chatId}...`);
    console.log(`🤖 Bot token: ${BOT_TOKEN.substring(0, 10)}...`);
    console.log(`💬 Message preview: ${message.substring(0, 100)}...`);

    // Check if bot is connected
    const botInfo = await bot.getMe();
    console.log(`✅ Bot connected as: @${botInfo.username}`);

    await bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    console.log(`✅ Message sent successfully to chat ${chatId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending message to chat ${chatId}:`, error.message);
    console.error('Full error details:', error);

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

    // Check for common errors
    if (error.message.includes('chat not found')) {
      console.error(`❌ Chat ${chatId} not found. Make sure the bot is added to the group.`);
    } else if (error.message.includes('bot was kicked')) {
      console.error(`❌ Bot was kicked from chat ${chatId}. Please re-add the bot to the group.`);
    } else if (error.message.includes('not enough rights')) {
      console.error(`❌ Bot doesn't have permission to send messages in chat ${chatId}.`);
    }

    return false;
  }
};

// Send photo with caption to specific chat
export const sendTelegramPhotoToChat = async (chatId, photoDataUrl, caption) => {
  try {
    console.log(`📤 Attempting to send photo to chat ${chatId}...`);

    // Check if bot is connected
    const botInfo = await bot.getMe();
    console.log(`✅ Bot connected as: @${botInfo.username}`);

    // Convert data URL to buffer
    let photoBuffer;
    if (photoDataUrl.startsWith('data:')) {
      const base64Data = photoDataUrl.split(',')[1];
      photoBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // If it's a URL, fetch it first
      const https = await import('https');
      const http = await import('http');

      return new Promise((resolve, reject) => {
        const url = new URL(photoDataUrl);
        const client = url.protocol === 'https:' ? https : http;

        client.get(photoDataUrl, (res) => {
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', async () => {
            photoBuffer = Buffer.concat(chunks);
            try {
              await bot.sendPhoto(chatId, photoBuffer, {
                caption: caption,
                parse_mode: 'HTML'
              });
              console.log(`✅ Photo sent successfully to chat ${chatId}`);
              resolve(true);
            } catch (sendError) {
              console.error(`❌ Error sending photo:`, sendError.message);
              reject(sendError);
            }
          });
        }).on('error', reject);
      });
    }

    await bot.sendPhoto(chatId, photoBuffer, {
      caption: caption,
      parse_mode: 'HTML'
    });
    console.log(`✅ Photo sent successfully to chat ${chatId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending photo to chat ${chatId}:`, error.message);
    console.error('Full error details:', error);
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
      return `${index + 1}. <b>${student.full_name}</b>`;
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
  const startTime = Date.now();
  
  // Set a timeout to prevent infinite hanging
  const timeout = setTimeout(() => {
    console.error('❌ Attendance summary timeout after 30 seconds');
  }, 30000);

  try {
    console.log(`📋 Starting attendance summary for group ${groupId}`);

    let group = await Group.findById(groupId).populate('course_id').maxTimeMS(5000);
    if (!group) {
      console.log(`❌ Group ${groupId} not found`);
      clearTimeout(timeout);
      return;
    }

    if (!group.telegram_chat_id) {
      console.log(`❌ Group ${group.name} has no telegram_chat_id`);
      clearTimeout(timeout);
      return;
    }

    console.log(`📋 Found group ${group.name} with chat_id: ${group.telegram_chat_id}`);

    // Refresh group data to get latest chat_id
    group = await Group.findById(groupId).populate('course_id').maxTimeMS(3000);
    console.log(`🔄 Refreshed group ${group.name} with chat_id: ${group.telegram_chat_id}`);

    // Get today's attendance records
    const attendanceRecords = await Attendance.find({
      group_id: groupId,
      date: new Date(date)
    }).populate('student_id').maxTimeMS(8000);

    // Get all students in group
    const allStudents = await Student.find({ group_id: groupId }).maxTimeMS(5000);

    // Separate present and absent students
    const presentStudents = attendanceRecords
      .filter(record => record.status === 'PRESENT')
      .map(record => ({
        ...record.student_id?.toObject() || {},
        score: record.score || 0
      }));

    const absentStudents = allStudents.filter(student =>
      !attendanceRecords.some(record =>
        record.student_id?._id?.toString() === student._id.toString() &&
        record.status === 'PRESENT'
      )
    );

    console.log(`📊 Attendance stats: Total students: ${allStudents.length}, Present: ${presentStudents.length}, Absent: ${absentStudents.length}`);

    // Send attendance summary (absent students)
    const attendanceMessage = formatAttendanceMessage(group, absentStudents, presentStudents);
    let currentChatId = group.telegram_chat_id;
    console.log(`📤 Attempting to send to chat_id: ${currentChatId}`);

    let attendanceSent = await sendTelegramMessageToChat(currentChatId, attendanceMessage);

    // If sending failed due to supergroup upgrade, try to update chat_id
    if (!attendanceSent) {
      console.log(`🔄 Failed to send attendance message, trying to update chat_id...`);
      const newChatId = await updateGroupChatId(group._id, currentChatId);
      if (newChatId !== currentChatId) {
        currentChatId = newChatId;
        console.log(`📤 Retrying attendance message with new chat_id: ${currentChatId}`);
        attendanceSent = await sendTelegramMessageToChat(currentChatId, attendanceMessage);
      }
    }

    // Send scores message (present students with scores)
    if (presentStudents.length > 0 && attendanceSent) {
      console.log(`📤 Sending scores message...`);
      const scoresMessage = formatScoresMessage(group, presentStudents);
      await sendTelegramMessageToChat(currentChatId, scoresMessage);
    }

    clearTimeout(timeout);
    console.log(`✅ Attendance summary and scores sent to group ${group.name} in ${Date.now() - startTime}ms`);
  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Error sending attendance summary:', error.message);
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
  testBotConnection,
  startPolling,
  sendTelegramPhotoToChat
};
