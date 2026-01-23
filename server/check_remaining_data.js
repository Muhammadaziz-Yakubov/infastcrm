import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/infastcrm')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Group = (await import('./models/Group.js')).default;
    const Student = (await import('./models/Student.js')).default;
    const Attendance = (await import('./models/Attendance.js')).default;
    const Payment = (await import('./models/Payment.js')).default;
    
    try {
      // Check if any 2-Guruh related data remains
      console.log('🔍 2-Guruhga tegishli qolgan ma\'lumotlar tekshirilmoqda...\n');
      
      // Check for any students that might have been in 2-Guruh
      const allStudents = await Student.find({});
      console.log(`📚 Jami o'quvchilar: ${allStudents.length}`);
      
      let found2GroupStudents = 0;
      for (const student of allStudents) {
        // Check if student name suggests they were in 2-Guruh
        if (student.full_name.includes('Feruza Nematova') || 
            student.full_name.includes('Abdulloh G`ulomjonov') ||
            student.full_name.includes('Muruvatxon To`lanboyeva') ||
            student.full_name.includes('Muhammadumar Marufjonov') ||
            student.full_name.includes('Asatillo Alisherov') ||
            student.full_name.includes('Akbarshox  Anvarjonov') ||
            student.full_name.includes('Xojiakbar Hasanboyev') ||
            student.full_name.includes('Qobiljon Hasanov') ||
            student.full_name.includes('Dilyorbek O`ktamov') ||
            student.full_name.includes('Qirg`izali Hosiljonov')) {
          
          console.log(`⚠️ 2-Guruh o'quvchisi topildi: ${student.full_name} (Group: ${student.group_id || 'No group'})`);
          found2GroupStudents++;
          
          // Check payments for this student
          const payments = await Payment.find({ student_id: student._id });
          if (payments.length > 0) {
            console.log(`   💰 To'lovlar: ${payments.length} ta`);
            payments.forEach(p => {
              console.log(`      - ${p.amount.toLocaleString()} so'm (${p.payment_date.toISOString().split('T')[0]})`);
            });
          }
          
          // Check attendance for this student
          const attendance = await Attendance.find({ student_id: student._id });
          if (attendance.length > 0) {
            console.log(`   📋 Davomat: ${attendance.length} ta`);
            attendance.forEach(a => {
              console.log(`      - ${a.date.toISOString().split('T')[0]} - ${a.status}`);
            });
          }
        }
      }
      
      if (found2GroupStudents === 0) {
        console.log('✅ 2-Guruhga tegishli hech qanday o\'quvchi topilmadi');
      }
      
      // Check for any orphaned payments or attendance
      const allPayments = await Payment.find({});
      console.log(`\n💰 Jami to'lovlar: ${allPayments.length}`);
      
      const allAttendance = await Attendance.find({});
      console.log(`📋 Jami davomat: ${allAttendance.length}`);
      
      // Check for payments/attendance without valid students
      let orphanedPayments = 0;
      let orphanedAttendance = 0;
      
      for (const payment of allPayments) {
        const student = await Student.findById(payment.student_id);
        if (!student) {
          orphanedPayments++;
          console.log(`⚠️ Orphaned to'lov: ${payment.amount.toLocaleString()} so'm (Student: ${payment.student_id})`);
        }
      }
      
      for (const attendance of allAttendance) {
        const student = await Student.findById(attendance.student_id);
        if (!student) {
          orphanedAttendance++;
          console.log(`⚠️ Orphaned davomat: ${attendance.date.toISOString().split('T')[0]} (Student: ${attendance.student_id})`);
        }
      }
      
      if (orphanedPayments === 0 && orphanedAttendance === 0) {
        console.log('\n✅ Hech qanday orphaned ma\'lumotlar yo\'q');
      }
      
    } catch (error) {
      console.error('❌ Xatolik:', error);
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
