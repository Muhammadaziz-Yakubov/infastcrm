import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import { checkPaymentStatus } from './jobs/paymentJob.js';
import { sendDailyReminders, sendAllClassReminders, testBotConnection, setupWebhook, handleWebhook, startPolling } from './services/telegramBot.js';
import authRoutes from './routes/auth.js';
import studentAuthRoutes from './routes/studentAuth.js';
import courseRoutes from './routes/courses.js';
import groupRoutes from './routes/groups.js';
import studentRoutes from './routes/students.js';
import leadRoutes from './routes/leads.js';
import marketingRoutes from './routes/marketing.js';
import paymentRoutes from './routes/payments.js';
import attendanceRoutes from './routes/attendance.js';
import dashboardRoutes from './routes/dashboard.js';
import staffRoutes from './routes/staff.js';
import taskRoutes from './routes/tasks.js';
import examRoutes from './routes/exams.js';
import studentExamRoutes from './routes/studentExams.js';
import publicRoutes from './routes/public.js';
import badgeRoutes from './routes/badges.js';
import certificateRoutes from './routes/certificates.js';
import quizRoutes from './routes/quizzes.js';
import studentQuizRoutes from './routes/studentQuizzes.js';
import { setupArenaSocket } from './socket/arena.js';
import { authenticate, requireAdmin } from './middleware/auth.js';
import User from './models/User.js';

dotenv.config();

console.log('🔧 Environment variables check:');
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'SET' : 'NOT SET'}`);
console.log(`TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'NOT SET'}`);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      process.env.FRONTEND_URL,
      /^https:\/\/.*\.vercel\.app$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Setup Arena Socket
setupArenaSocket(io);

const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const tasksDir = path.join(uploadsDir, 'tasks');

if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(tasksDir)) {
  console.log('📁 Creating tasks directory...');
  fs.mkdirSync(tasksDir, { recursive: true });
}

// Function to create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'muhammadazizyaqubov2@gmail.com';
    const adminPassword = 'Azizbek0717';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword,
        full_name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE'
      });

      await adminUser.save();
      console.log('✅ Default admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('🔐 Password: Azizbek0717');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
  }
};

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://www.buloqboshi-tumani.uz',
    'https://buloqboshi-tumani.uz',
    process.env.FRONTEND_URL,
    // Vercel domains
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/infast-crm.*\.vercel\.app$/,
  ].filter(Boolean),
  credentials: true
}));
// Parse JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory with debug logging
// Use absolute path for production compatibility
app.use('/uploads', (req, res, next) => {
  console.log(`📁 Uploads access: ${req.method} ${req.url}`);
  console.log(`📁 Uploads dir: ${uploadsDir}`);
  next();
}, express.static(uploadsDir));

// Telegram webhook endpoint
app.post('/api/telegram/webhook', (req, res, next) => {
  console.log('🔗 Incoming webhook request:', {
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for']
    },
    bodySize: JSON.stringify(req.body).length
  });
  handleWebhook(req, res, next);
});

// Test endpoint for webhook accessibility
app.get('/api/telegram/webhook-test', (req, res) => {
  console.log('🧪 Webhook test endpoint accessed from:', req.ip, req.headers['user-agent']);
  res.json({
    status: 'ok',
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    webhook_url: process.env.WEBHOOK_URL || 'https://infastcrm-0b2r.onrender.com/api/telegram/webhook'
  });
});

// Test bot connectivity
app.get('/api/telegram/bot-test', async (req, res) => {
  try {
    console.log('🧪 Testing bot connectivity...');
    const botInfo = await bot.getMe();
    const webhookInfo = await bot.getWebHookInfo();

    res.json({
      status: 'ok',
      bot_info: {
        id: botInfo.id,
        username: botInfo.username,
        first_name: botInfo.first_name
      },
      webhook_info: {
        url: webhookInfo.url || 'none',
        has_custom_certificate: webhookInfo.has_custom_certificate,
        pending_update_count: webhookInfo.pending_update_count,
        last_error_message: webhookInfo.last_error_message
      },
      is_polling: bot.isPolling(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Bot test failed:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Test auth endpoint
app.get('/api/test-auth', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date().toISOString()
  });
});

// Test admin endpoint
app.get('/api/test-admin', authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin access confirmed',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date().toISOString()
  });
});

// Bot diagnostic endpoint
app.get('/api/bot/status', async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      webhook_url: process.env.WEBHOOK_URL || 'not set',
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || 'not set',
      bot_token_configured: !!process.env.TELEGRAM_BOT_TOKEN,
      bot_status: {}
    };

    // Check bot connectivity
    try {
      const botInfo = await bot.getMe();
      diagnostics.bot_status.bot_info = {
        id: botInfo.id,
        username: botInfo.username,
        first_name: botInfo.first_name
      };
    } catch (error) {
      diagnostics.bot_status.bot_error = error.message;
    }

    // Check webhook status
    try {
      const webhookInfo = await bot.getWebHookInfo();
      diagnostics.bot_status.webhook_info = {
        url: webhookInfo.url || 'none',
        has_custom_certificate: webhookInfo.has_custom_certificate,
        pending_update_count: webhookInfo.pending_update_count,
        last_error_message: webhookInfo.last_error_message,
        last_error_date: webhookInfo.last_error_date
      };
    } catch (error) {
      diagnostics.bot_status.webhook_error = error.message;
    }

    // Check polling status
    diagnostics.bot_status.is_polling = bot.isPolling();

    // Recommendations
    diagnostics.recommendations = [];
    if (process.env.NODE_ENV === 'production') {
      if (!diagnostics.bot_status.webhook_info?.url || diagnostics.bot_status.webhook_info.url === 'none') {
        diagnostics.recommendations.push('Webhook not set - bot may not receive messages');
      }
      if (diagnostics.bot_status.is_polling) {
        diagnostics.recommendations.push('Polling active in production - may cause conflicts with multiple instances');
      }
      if (!diagnostics.webhook_url.includes('onrender.com')) {
        diagnostics.recommendations.push('Webhook URL may not be accessible from Telegram servers');
      }
    }

    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test message sending
app.post('/api/bot/test-message', async (req, res) => {
  try {
    const { chat_id, message } = req.body;

    if (!chat_id || !message) {
      return res.status(400).json({ error: 'chat_id and message are required' });
    }

    console.log(`🧪 Testing message send to chat ${chat_id}`);
    const success = await sendTelegramMessageToChat(chat_id, `🧪 <b>Test Message</b>\n\n${message}`);

    if (success) {
      res.json({ success: true, message: 'Test message sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send test message' });
    }
  } catch (error) {
    console.error('Test message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quick bot test with default chat ID
app.get('/api/bot/test-send', async (req, res) => {
  try {
    const testChatId = process.env.TELEGRAM_CHAT_ID || '-5125551645';
    const testMessage = `🤖 <b>Bot Test Message</b>

⏰ Time: ${new Date().toISOString()}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Webhook: ${process.env.WEBHOOK_URL || 'not set'}

This is a test message to verify bot functionality.`;

    console.log(`🧪 Sending test message to chat ${testChatId}`);
    const success = await sendTelegramMessageToChat(testChatId, testMessage);

    res.json({
      success,
      chat_id: testChatId,
      timestamp: new Date().toISOString(),
      message: success ? 'Test message sent successfully' : 'Failed to send test message'
    });
  } catch (error) {
    console.error('Bot test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infast-crm';

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Test Telegram bot connection on startup (only once)
setTimeout(async () => {
  const connected = await testBotConnection();
  if (connected) {
    console.log('🤖 Telegram bot successfully connected and ready!');

    // Setup bot based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const hasWebhookUrl = !!process.env.WEBHOOK_URL;

    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Webhook URL configured: ${hasWebhookUrl ? 'yes' : 'no'}`);
    console.log(`🎯 Bot strategy: ${isProduction ? 'production (webhook only)' : 'development (polling only)'}`);

    if (isProduction) {
      // In production, ONLY use webhooks - no polling fallback to avoid conflicts
      console.log('🔄 Setting up Telegram webhook for production...');

      if (!hasWebhookUrl) {
        console.error('❌ WEBHOOK_URL environment variable is required in production!');
        console.error('📝 Set WEBHOOK_URL in your Render environment variables');
        console.error('📋 Example: https://your-app-name.onrender.com/api/telegram/webhook');
        return;
      }

      const webhookSet = await setupWebhook();
      if (webhookSet) {
        console.log('✅ Telegram webhook setup completed successfully');
        console.log('📡 Bot is now running in webhook mode');
      } else {
        console.error('❌ Telegram webhook setup failed!');
        console.error('🔍 Check the webhook URL accessibility:');
        console.log(`   GET ${process.env.WEBHOOK_URL.replace('/webhook', '/webhook-test')}`);
        console.error('🔍 Bot may not receive messages until webhook is working');
      }
    } else {
      // In development, use polling only
      console.log('⚠️ Running in development mode, starting polling...');
      const pollingStarted = await startPolling();
      if (pollingStarted) {
        console.log('✅ Development polling started successfully');
      } else {
        console.error('❌ Development polling failed to start');
      }
    }
  }
}, 3000);

// Log all API requests for debugging
app.use('/api/*', (req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student-auth', studentAuthRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/student/exams', studentExamRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/student/quizzes', studentQuizRoutes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Server xatosi yuz berdi',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Sahifa topilmadi'
  });
});

// Daily job to check payment status (runs at 9 AM every day)
cron.schedule('0 9 * * *', () => {
  console.log('🔄 Running daily payment status check...');
  checkPaymentStatus();
});

// Daily payment reminders (runs at 12:00 PM every day)
cron.schedule('0 12 * * *', () => {
  console.log('📅 Sending daily payment reminders...');
  sendDailyReminders();
});

// Daily class reminders (runs at 7:00 AM every day)
cron.schedule('0 7 * * *', () => {
  console.log('📚 Sending daily class reminders...');
  sendAllClassReminders();
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
