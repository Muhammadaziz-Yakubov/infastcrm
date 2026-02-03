import mongoose from 'mongoose';

const marketOrderSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketItem',
    required: true
  },
  item_name: {
    type: String,
    required: true
  },
  item_price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING'
  },
  confirmed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  confirmed_at: {
    type: Date
  },
  cancelled_reason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

marketOrderSchema.index({ student_id: 1, status: 1 });
marketOrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('MarketOrder', marketOrderSchema);
