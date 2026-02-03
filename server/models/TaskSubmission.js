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
<<<<<<< HEAD
    default: ''
=======
    required: true
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  },
  description: {
    type: String,
    default: ''
  },
<<<<<<< HEAD
  submitted_files: [{
    filename: String,
    original_name: String,
    file_path: String,
    file_size: Number,
    mime_type: String
  }],
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  submitted_at: {
    type: Date,
    default: Date.now
  },
  // Grading
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  graded_at: {
    type: Date
  },
  graded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'GRADED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Prevent duplicate submissions
taskSubmissionSchema.index({ task_id: 1, student_id: 1 }, { unique: true });
<<<<<<< HEAD
taskSubmissionSchema.index({ student_id: 1 });
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

export default mongoose.model('TaskSubmission', taskSubmissionSchema);

