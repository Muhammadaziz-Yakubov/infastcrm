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
  image_url: {
    type: String,
    default: ''
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  deadline: {
    type: Date
  },
  max_score: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'CLOSED'],
    default: 'ACTIVE'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

<<<<<<< HEAD
taskSchema.index({ group_id: 1, status: 1, createdAt: -1 });

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
export default mongoose.model('Task', taskSchema);

