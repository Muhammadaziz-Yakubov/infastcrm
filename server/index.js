import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { checkPaymentStatus } from './jobs/paymentJob.js';
import { sendDailyReminders, sendAllClassReminders, testBotConnection, setupWebhook, handleWebhook } from './services/telegramBot.js';
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
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Telegram webhook endpoint
app.post('/api/telegram/webhook', handleWebhook);

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
    
    // Setup webhook if WEBHOOK_URL is provided
    if (process.env.WEBHOOK_URL) {
      await setupWebhook();
    } else {
      console.log('⚠️ WEBHOOK_URL not provided, bot will use polling');
    }
  }
}, 3000);

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
