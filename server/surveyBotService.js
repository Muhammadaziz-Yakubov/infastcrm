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

export const initSurveyBot = () => {
    try {
        const bot = new TelegramBot(TOKEN, { polling: true });

        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;

            // Only respond in private chats for the survey
            if (msg.chat.type !== 'private') return;

            if (text === '/start') {
                sessions[chatId] = { stepIndex: 0, data: {} };
                await bot.sendMessage(chatId, `Assalomu alaykum! Botga xush kelibsiz.\n\n${steps[0].question}`);
                return;
            }

            const session = sessions[chatId];
            if (!session) return;

            const currentStep = steps[session.stepIndex];
            session.data[currentStep.key] = text;
            session.stepIndex++;

            if (session.stepIndex < steps.length) {
                await bot.sendMessage(chatId, steps[session.stepIndex].question);
            } else {
                // Survey complete
                await bot.sendMessage(chatId, "Rahmat vaqtingizni ajratganingiz uchun!");

                // Format the data and send to group
                const report = `
📝 <b>Yangi so'rovnoma ma'lumotlari:</b>

👤 <b>F.I.SH:</b> ${session.data.fullName}
📍 <b>Tuman:</b> ${session.data.district}
 <b>Maktab:</b> ${session.data.school}
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
        });

        bot.on('polling_error', (error) => {
            if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
                // Ignore conflict errors - another instance might be running briefly during dev
                return;
            }
            console.error('Survey Bot Polling Error:', error.message);
        });

        console.log('✅ Standalone Survey Bot successfully initialized and running');
    } catch (error) {
        console.error('❌ Failed to initialize Standalone Survey Bot:', error.message);
    }
};
