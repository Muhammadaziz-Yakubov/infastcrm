import mongoose from 'mongoose';

const marketItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['DISCOUNT', 'BONUS', 'PREMIUM', 'LESSON', 'GIFT', 'OTHER'],
    default: 'OTHER'
  },
  stock: {
    type: Number,
    default: -1
  },
  is_active: {
    type: Boolean,
    default: true
  },
  requires_confirmation: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

marketItemSchema.index({ is_active: 1, price: 1 });

export default mongoose.model('MarketItem', marketItemSchema);
