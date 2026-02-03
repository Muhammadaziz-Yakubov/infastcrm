import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  days_of_week: [{
    type: String,
    enum: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    required: true
  }],
  time: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  max_students: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  min_students: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  status: {
    type: String,
    enum: ['NABOR', 'ACTIVE', 'COMPLETED', 'STOPPED'],
    default: 'NABOR'
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  telegram_chat_id: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration_months: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

// Index for better query performance
groupSchema.index({ course_id: 1, status: 1 });
groupSchema.index({ teacher_id: 1 });
groupSchema.index({ status: 1 });

const Group = mongoose.model('Group', groupSchema);

export default Group;
