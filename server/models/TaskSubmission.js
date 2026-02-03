import mongoose from 'mongoose';

const taskSubmissionSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  code: {
    type: String,
    default: ''  },
  description: {
    type: String,
    default: ''
  },
  submitted_files: [{
    filename: String,
    original_name: String,
    file_path: String,
    file_size: Number,
    mime_type: String
  }],
export default mongoose.model('TaskSubmission', taskSubmissionSchema);

