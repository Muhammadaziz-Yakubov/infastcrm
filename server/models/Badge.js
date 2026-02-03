import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    enum: ['ATTENDANCE', 'PERFECT_SCORE', 'HOMEWORK_EXCELLENCE', 'STREAK', 'FAOL_OQUVCHI'],
    required: true
  },
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
  condition: {
    type: String,
    default: '' // Qaysi shart bilan olingani (masalan: "Oxirgi 5 darsga to'liq qatnashgan")
  },
  earned_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
badgeSchema.index({ student_id: 1, type: 1 });
badgeSchema.index({ student_id: 1, earned_at: -1 });

export default mongoose.model('Badge', badgeSchema);
