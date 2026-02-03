import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  total_points: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'FINISHED'],
    default: 'DRAFT'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question_text: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correct_answer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    points: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Validate that end_date is after start_date
examSchema.pre('validate', function() {
  if (Array.isArray(this.questions)) {
    const total = this.questions.reduce((sum, q) => sum + (Number(q?.points) || 0), 0);
    this.total_points = total;
  }

  if (!this.start_date || !this.end_date) return;

  const startDate = new Date(this.start_date);
  const endDate = new Date(this.end_date);

  if (endDate <= startDate) {
    this.invalidate('end_date', 'End date must be after start date');
  }
});

export default mongoose.model('Exam', examSchema);
