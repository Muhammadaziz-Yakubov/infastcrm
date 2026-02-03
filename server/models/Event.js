import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  banner: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  registration_deadline: {
    type: Date,
    required: true
  },
  max_participants: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  coin_reward: {
    type: Number,
    default: 500
  },
  coin_penalty: {
    type: Number,
    default: -500
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  registrations: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    registered_at: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    coin_given: {
      type: Boolean,
      default: false
    }
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

eventSchema.index({ event_date: 1 });
eventSchema.index({ registration_deadline: 1 });

export default mongoose.model('Event', eventSchema);
