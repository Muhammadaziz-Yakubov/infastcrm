import TelegramBot from 'node-telegram-bot-api';

const TOKEN = '7207122323:AAHTpschQld8gQKJ-EUL2qB182aoQ70MxWU';
const GROUP_CHAT_ID = '-1003717097048';

const steps = [
    { key: 'fullName', question: 'Ism, familiya va otasining ismini kiriting:' },
    { key: 'district', question: 'Qaysi tumanda yashaysiz?' },
    { key: 'school', question: 'Qaysi maktabda o\'qiysiz?' },
    { key: 'schoolClass', question: 'Qaysi sinfda o\'qiysiz?' },
    { key: 'mfy', question: 'Qaysi MFY (Mahalla fuqarolar yig\'ini) dan ekanligingizni kiriting?' },
    { key: 'street', question: 'Mahalla/Ko\'cha nomini kiriting:' },
    { key: 'house', question: 'Uy raqamingizni kiriting:' },
    { key: 'parentPhone', question: 'Ota-onangizning telefon raqamini kiriting:' }
];

const sessions = {};
// To prevent processing the same message multiple times across instances (mostly helps with restarts)
const processedMessageIds = new Set();

export const initSurveyBot = async () => {
    // Avoid running the survey bot locally if we are in development and want to avoid conflicts with production
    if (process.env.DISABLE_SURVEY_BOT === 'true') {
        console.log('🚫 Standalone Survey Bot is disabled via environment variable');
        return Promise.resolve();
    }

    try {
        const bot = new TelegramBot(TOKEN, { 
            polling: {
                interval: 1000, // Poll every 1 second instead of default
                autoStart: false // Don't start automatically
            }
        });

        // Start polling with error handling
        await bot.startPolling();
        console.log('✅ Standalone Survey Bot successfully initialized and running');

        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;
            const messageId = msg.message_id;

            // 1. Basic checks
            if (msg.chat.type !== 'private' || !text) return;

            // 2. Prevent duplicate processing of the same message ID
            if (processedMessageIds.has(messageId)) return;
            processedMessageIds.add(messageId);

            // Keep memory clean (keep only last 100 message IDs)
            if (processedMessageIds.size > 100) {
                const firstId = processedMessageIds.values().next().value;
                processedMessageIds.delete(firstId);
            }

            // 3. Handle /start - RESET Session
            if (text === '/start') {
                sessions[chatId] = { stepIndex: 0, data: {}, isProcessing: false };
                await bot.sendMessage(chatId, `Assalomu alaykum! Botga xush kelibsiz.\n\n${steps[0].question}`);
                return;
            }

            const session = sessions[chatId];
            if (!session) return;

            // 4. Lock mechanism to prevent race conditions during rapid messages
            if (session.isProcessing) return;
            session.isProcessing = true;

            try {
                const currentStep = steps[session.stepIndex];
                session.data[currentStep.key] = text;
                session.stepIndex++;

                if (session.stepIndex < steps.length) {
                    await bot.sendMessage(chatId, steps[session.stepIndex].question);
                    session.isProcessing = false; // Unlock for next answer
                } else {
                    // Survey complete
                    await bot.sendMessage(chatId, "Rahmat vaqtingizni ajratganingiz uchun!");

                    // Format the data and send to group
                    const report = `
📝 <b>Yangi so'rovnoma ma'lumotlari:</b>

👤 <b>F.I.SH:</b> ${session.data.fullName}
📍 <b>Tuman:</b> ${session.data.district}
🏫 <b>Maktab:</b> ${session.data.school}
🎓 <b>Sinf:</b> ${session.data.schoolClass}
🏢 <b>MFY:</b> ${session.data.mfy}
🏘 <b>Mahalla/Ko'cha:</b> ${session.data.street}
🏠 <b>Uy raqami:</b> ${session.data.house}
📞 <b>Ota-ona raqami:</b> ${session.data.parentPhone}

📅 <i>Jo'natilgan sana: ${new Date().toLocaleString('uz-UZ')}</i>
                    `.trim();

                    try {
                        await bot.sendMessage(GROUP_CHAT_ID, report, { parse_mode: 'HTML' });
                    } catch (groupError) {
                        console.error('Error sending survey report to group:', groupError.message);
                    }

                    delete sessions[chatId];
                }
            } catch (err) {
                console.error('Error processing survey step:', err);
                session.isProcessing = false;
            }
        });

        bot.on('polling_error', (error) => {
            if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
                console.warn('⚠️ Polling Conflict: Multiple bot instances detected. Please turn off local server if production is active.');
                return;
            }
            console.error('Survey Bot Polling Error:', error.message);
        });

        return Promise.resolve();
    } catch (error) {
        console.error('❌ Failed to initialize Standalone Survey Bot:', error.message);
        return Promise.reject(error);
    }
};
