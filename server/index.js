import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import nodeCron from 'node-cron';
import compression from 'compression';

// Routes
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import groupRoutes from './routes/groups.js';
import attendanceRoutes from './routes/attendance.js';
import paymentRoutes from './routes/payments.js';
import leadRoutes from './routes/leads.js';
import dashboardRoutes from './routes/dashboard.js';
import staffRoutes from './routes/staff.js';
import smsRoutes from './routes/sms.js';
import coinsRoutes from './routes/coins.js';
import badgesRoutes from './routes/badges.js';
import marketingRoutes from './routes/marketing.js';
import marketRoutes from './routes/market.js';
import eventRoutes from './routes/events.js';
import publicRoutes from './routes/public.js';
import studentAuthRoutes from './routes/studentAuth.js';
import referralRoutes from './routes/referrals.js';
import taskRoutes from './routes/tasks.js';
import certificatesRoutes from './routes/certificates.js';
import examsRoutes from './routes/exams.js';
import quizzesRoutes from './routes/quizzes.js';
import studentExamsRoutes from './routes/studentExams.js';
import studentQuizzesRoutes from './routes/studentQuizzes.js';
import ratingRoutes from './routes/rating.js';
import arenaRoutes from './routes/arena.js';
import adminArenaRoutes from './routes/adminArena.js';

// Services & Jobs
import { setupArenaSocket } from './socket/arena.js';
import { sendDailyReminders, testBotConnection, setupWebhook, handleWebhook, sendAllClassReminders } from './services/telegramBot.js';
import { checkPaymentStatus } from './jobs/paymentJob.js';
import { initSurveyBot } from './surveyBotService.js';
import { sendDebtorSmsReminders } from './jobs/debtorSmsJob.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    transports: ['polling'], // Use polling for production compatibility
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Telegram Webhook route (must be before /api routes or handled specifically)
app.post('/api/telegram/webhook', handleWebhook);
app.get('/api/telegram/webhook-test', (req, res) => res.json({ status: 'ok', time: new Date() }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/coins', coinsRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/student-auth', studentAuthRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/student-exams', studentExamsRoutes);
app.use('/api/student-quizzes', studentQuizzesRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/arena', arenaRoutes);
app.use('/api/admin/arena', adminArenaRoutes);

// Socket.io setup
setupArenaSocket(io);

// Database connection with timeout
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://muhammadyakubov:vNq4X9x9X9x9X9x9@cluster0.abcde.mongodb.net/infastcrm';

// Add connection timeout
const connectWithTimeout = () => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('MongoDB connection timeout'));
        }, 15000); // 15 second timeout

        mongoose.connect(MONGODB_URI)
            .then(() => {
                clearTimeout(timeout);
                resolve();
            })
            .catch((err) => {
                clearTimeout(timeout);
                reject(err);
            });
    });
};

connectWithTimeout()
    .then(() => {
        console.log('✅ Connected to MongoDB');

        // Initialize services asynchronously to avoid blocking startup
        initializeServices();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        // Continue with server startup even if MongoDB fails initially
        console.log('⚠️ Server will start anyway, MongoDB will retry...');
        initializeServices();
    });

// Initialize services asynchronously
const initializeServices = async () => {
    // Start services in background without blocking server startup
    setTimeout(() => {
        testBotConnection().catch(err =>
            console.log('⚠️ Telegram bot connection failed (non-critical):', err.message)
        );
    }, 2000); // 2 second delay

    setTimeout(() => {
        initSurveyBot().catch(err =>
            console.log('⚠️ Survey bot initialization failed (non-critical):', err.message)
        );
    }, 5000); // 5 second delay

    if (process.env.NODE_ENV === 'production') {
        setTimeout(() => {
            setupWebhook().catch(err =>
                console.log('⚠️ Webhook setup failed (non-critical):', err.message)
            );
        }, 8000); // 8 second delay
    }
};

// Cron Jobs
// Daily payment status check at 00:00
nodeCron.schedule('0 0 * * *', () => {
    console.log('⏰ Running daily payment status check...');
    checkPaymentStatus();
});

// Daily Telegram reminders at 12:00
nodeCron.schedule('0 12 * * *', () => {
    console.log('⏰ Running daily Telegram reminders...');
    sendDailyReminders();
});

// Daily Debtor SMS reminders at 10:00
nodeCron.schedule('0 10 * * *', () => {
    console.log('⏰ Running daily debtor SMS reminders...');
    sendDebtorSmsReminders();
});

// Class reminders at 07:00
nodeCron.schedule('0 7 * * *', () => {
    console.log('⏰ Running class reminders...');
    sendAllClassReminders();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Serverda ichki xatolik yuz berdi' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
