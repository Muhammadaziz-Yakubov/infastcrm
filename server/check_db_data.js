import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const Group = mongoose.model('Group', new mongoose.Schema({ name: String }));
        const Student = mongoose.model('Student', new mongoose.Schema({ full_name: String, group_id: mongoose.Schema.Types.ObjectId }));

        const groups = await Group.find({});
        console.log('\n--- Groups ---');
        for (const g of groups) {
            const studentCount = await Student.countDocuments({ group_id: g._id });
            console.log(`Group: ${g.name} (ID: ${g._id}) - Students count: ${studentCount}`);

            if (g.name.includes('2')) {
                const students = await Student.find({ group_id: g._id });
                if (students.length > 0) {
                    console.log(`   Students in this group: ${students.map(s => s.full_name).join(', ')}`);
                } else {
                    console.log(`   No students found for this group.`);
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkData();
