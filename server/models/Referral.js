import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  friend_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  discount_percent: {
    type: Number,
    default: 20,
    min: 0,
    max: 100
  },
  discount_active: {
    type: Boolean,
    default: false
  },
  friend_first_payment_date: {
    type: Date
  },
  friend_first_payment_amount: {
    type: Number
  },
  total_discount_given: {
    type: Number,
    default: 0
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_date: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

referralSchema.index({ referrer_id: 1, friend_id: 1 }, { unique: true });
referralSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Referral', referralSchema);
