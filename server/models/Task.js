import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  max_score: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  file_path: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
    default: 'DRAFT'
  },
  task_type: {
    type: String,
    enum: ['HOMEWORK', 'PROJECT', 'EXAM', 'QUIZ'],
    default: 'HOMEWORK'
  }
}, {
  timestamps: true
});

// Index for better query performance
taskSchema.index({ group_id: 1, status: 1 });
taskSchema.index({ teacher_id: 1 });
taskSchema.index({ due_date: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
