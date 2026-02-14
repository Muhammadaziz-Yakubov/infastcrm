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
    default: ''
  },
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
  score: {
    type: Number,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'GRADED'],
    default: 'SUBMITTED'
  },
  submitted_at: {
    type: Date,
    default: Date.now
  },
  graded_at: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('TaskSubmission', taskSubmissionSchema);
