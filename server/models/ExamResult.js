import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  answers: [{
    question_index: {
      type: Number,
      required: true
    },
    selected_answer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  total_points: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  started_at: {
    type: Date,
    default: Date.now
  },
  finished_at: {
    type: Date
  },
  status: {
    type: String,
    enum: ['STARTED', 'FINISHED', 'TIME_EXPIRED'],
    default: 'STARTED'
  },
  time_taken: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

examResultSchema.index({ student_id: 1 });
examResultSchema.index({ exam_id: 1 });

// Calculate percentage when score is updated
examResultSchema.pre('save', function () {
  if (this.total_points > 0) {
    this.percentage = (this.score / this.total_points) * 100;
  }
});

export default mongoose.model('ExamResult', examResultSchema);
