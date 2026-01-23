import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/infastcrm')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Student = (await import('./models/Student.js')).default;
    const Attendance = (await import('./models/Attendance.js')).default;
    const Payment = (await import('./models/Payment.js')).default;
    
    try {
      console.log('🗑️ 2-Guruhga tegishli barcha ma\'lumotlar o\'chirilmoqda...\n');
      
      // 2-Guruh o'quvchilarining ismlari
      const group2StudentNames = [
        'Feruza Nematova',
        'Abdulloh G`ulomjonov', 
        'Muruvatxon To`lanboyeva',
        'Muhammadumar Marufjonov',
        'Asatillo Alisherov',
        'Akbarshox  Anvarjonov',
        'Xojiakbar Hasanboyev',
        'Qobiljon Hasanov',
        'Dilyorbek O`ktamov',
        'Qirg`izali Hosiljonov'
      ];
      
      let totalDeleted = {
        students: 0,
        attendance: 0,
        payments: 0
      };
      
      // Find and delete all 2-Guruh students
      for (const studentName of group2StudentNames) {
        const students = await Student.find({ full_name: studentName });
        
        for (const student of students) {
          console.log(`👤 O'quvchi o'chirilmoqda: ${student.full_name}`);
          
          // Delete payments for this student
          const paymentResult = await Payment.deleteMany({ student_id: student._id });
          totalDeleted.payments += paymentResult.deletedCount;
          if (paymentResult.deletedCount > 0) {
            console.log(`   💰 ${paymentResult.deletedCount} ta to'lov o'chirildi`);
          }
          
          // Delete attendance for this student
          const attendanceResult = await Attendance.deleteMany({ student_id: student._id });
          totalDeleted.attendance += attendanceResult.deletedCount;
          if (attendanceResult.deletedCount > 0) {
            console.log(`   📋 ${attendanceResult.deletedCount} ta davomat o'chirildi`);
          }
          
          // Delete the student
          await Student.findByIdAndDelete(student._id);
          totalDeleted.students += 1;
          console.log(`   ✅ O'quvchi o'chirildi`);
        }
      }
      
      // Clean up orphaned records (payments/attendance without students)
      console.log('\n🧹 Orphaned yozuvlar tozalanmoqda...');
      
      // Get all remaining students
      const remainingStudents = await Student.find({});
      const remainingStudentIds = remainingStudents.map(s => s._id);
      
      // Delete payments for non-existent students
      const orphanedPayments = await Payment.deleteMany({
        student_id: { $nin: remainingStudentIds }
      });
      totalDeleted.payments += orphanedPayments.deletedCount;
      if (orphanedPayments.deletedCount > 0) {
        console.log(`💰 ${orphanedPayments.deletedCount} ta orphaned to'lov o'chirildi`);
      }
      
      // Delete attendance for non-existent students
      const orphanedAttendance = await Attendance.deleteMany({
        student_id: { $nin: remainingStudentIds }
      });
      totalDeleted.attendance += orphanedAttendance.deletedCount;
      if (orphanedAttendance.deletedCount > 0) {
        console.log(`📋 ${orphanedAttendance.deletedCount} ta orphaned davomat o'chirildi`);
      }
      
      console.log('\n📊 O\'chirilgan narsalar jami:');
      console.log(`   O\'quvchilar: ${totalDeleted.students}`);
      console.log(`   To\'lovlar: ${totalDeleted.payments}`);
      console.log(`   Davomat: ${totalDeleted.attendance}`);
      
      console.log('\n🎉 2-Guruhga tegishli barcha ma\'lumotlar to\'liq o\'chirildi!');
      
    } catch (error) {
      console.error('❌ Xatolik:', error);
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
