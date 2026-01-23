import mongoose from 'mongoose';
import Student from './models/Student.js';
import Group from './models/Group.js';

mongoose.connect('mongodb+srv://yakubovdev:Azizbek0717@cluster0.zd8gpsb.mongodb.net/infast-crm?retryWrites=true&w=majority')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const groupId = '696aa40d9e329120485b31f3';
      const objectId = new mongoose.Types.ObjectId(groupId);
      
      console.log(`\n🔍 Testing with ObjectId: ${objectId}`);
      
      // Test the exact same query as the server
      const students = await Student.find({ group_id: objectId });
      console.log(`📊 Students found with ObjectId: ${students.length}`);
      
      // Test with string (for comparison)
      const studentsWithString = await Student.find({ group_id: groupId });
      console.log(`📊 Students found with string: ${studentsWithString.length}`);
      
      // Check group exists
      const group = await Group.findById(objectId);
      console.log(`🏷️ Group found: ${group ? group.name : 'Not found'}`);
      
      // Check if students have this group_id
      const allStudents = await Student.find({});
      const studentsInGroup = allStudents.filter(s => 
        s.group_id && s.group_id.toString() === groupId
      );
      console.log(`📊 Students with this group_id (manual check): ${studentsInGroup.length}`);
      
      if (studentsInGroup.length > 0) {
        console.log('\n👥 Students found:');
        studentsInGroup.forEach(s => {
          console.log(`   - ${s.full_name} (${s.status}) - group_id: ${s.group_id}`);
        });
      }
      
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    mongoose.connection.close();
  })
  .catch(console.error);
