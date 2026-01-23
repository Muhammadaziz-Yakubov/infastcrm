import mongoose from 'mongoose';
import Student from './models/Student.js';
import Group from './models/Group.js';

mongoose.connect('mongodb+srv://yakubovdev:Azizbek0717@cluster0.zd8gpsb.mongodb.net/infast-crm?retryWrites=true&w=majority')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const groupId = '696aa40d9e329120485b31f3';
      
      // Get group info
      const group = await Group.findById(groupId);
      console.log(`\n🏷️ Group: ${group?.name || 'Not found'}`);
      console.log(`📊 Status: ${group?.status || 'Unknown'}`);
      
      // Get ALL students in this group
      const allStudents = await Student.find({ group_id: groupId });
      console.log(`\n📊 Total students in group: ${allStudents.length}`);
      
      if (allStudents.length > 0) {
        console.log('\n👥 All students:');
        allStudents.forEach(s => {
          console.log(`   - ${s.full_name} (${s.status})`);
        });
      }
      
      // Get only ACTIVE students
      const activeStudents = await Student.find({ 
        group_id: groupId, 
        status: 'ACTIVE' 
      });
      console.log(`\n✅ Active students: ${activeStudents.length}`);
      
      // Get DEBTOR students too
      const debtorStudents = await Student.find({ 
        group_id: groupId, 
        status: 'DEBTOR' 
      });
      console.log(`💰 Debtor students: ${debtorStudents.length}`);
      
      // Check if frontend should see them
      const shouldSee = activeStudents.length + debtorStudents.length;
      console.log(`\n👀 Frontend should see: ${shouldSee} students`);
      
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    mongoose.connection.close();
  })
  .catch(console.error);
