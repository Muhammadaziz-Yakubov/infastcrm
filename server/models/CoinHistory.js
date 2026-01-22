import mongoose from 'mongoose';

const coinHistorySchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['EARN', 'SPEND', 'ADMIN_ADD', 'ADMIN_DEDUCT'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  reason_type: {
    type: String,
    enum: ['ATTENDANCE_PRESENT', 'ATTENDANCE_ABSENT', 'HOMEWORK_SUBMITTED', 'HOMEWORK_NOT_SUBMITTED', 'QUIZ_COMPLETED', 'QUIZ_NOT_COMPLETED', 'ADMIN_MANUAL', 'MARKET_PURCHASE', 'ORDER_CANCELLED'],
    required: true
  },
  balance_after: {
    type: Number,
    required: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

coinHistorySchema.index({ student_id: 1, createdAt: -1 });
coinHistorySchema.index({ group_id: 1 });
coinHistorySchema.index({ is_deleted: 1 });

export default mongoose.model('CoinHistory', coinHistorySchema);
