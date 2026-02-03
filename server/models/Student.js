import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
<<<<<<< HEAD
  phone: {  
=======
  phone: {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    type: String,
    required: true,
    trim: true
  },
  parent_phone: {
    type: String,
    default: ''
  },
<<<<<<< HEAD
  profile_image: {
    type: String,
    default: '' // Profile rasmi (base64 yoki URL)
  },
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  // Login credentials for student cabinet
  login: {
    type: String,
    unique: true,
    sparse: true, // allows multiple nulls
    trim: true
  },
  password: {
    type: String,
    select: false // don't include password by default
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  status: {
    type: String,
    enum: ['LEAD', 'ACTIVE', 'DEBTOR', 'STOPPED'],
    default: 'LEAD'
  },
  joined_date: {
    type: Date,
    default: Date.now
  },
  last_payment_date: {
    type: Date
  },
  next_payment_date: {
    type: Date
<<<<<<< HEAD
  },
  lead_source: {
    type: String,
    enum: ['Instagram', 'Telegram', 'Tanishlar', 'Reklama', 'Veb-sayt', 'Boshqa'],
    default: 'Boshqa'
  },
  original_lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  conversion_date: {
    type: Date,
    default: Date.now
  },

  // Coin balance
  coin_balance: {
    type: Number,
    default: 0,
    min: 0
  },

  // Gamification fields
  gamification: {
    total_xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    current_level_xp: {
      type: Number,
      default: 0
    },
    next_level_xp: {
      type: Number,
      default: 100
    },
    streak_days: {
      type: Number,
      default: 0
    },
    last_activity_date: {
      type: Date,
      default: Date.now
    },
    weekly_xp: {
      type: Number,
      default: 0
    },
    monthly_xp: {
      type: Number,
      default: 0
    }
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  }
}, {
  timestamps: true
});

<<<<<<< HEAD
// Indexes for performance
studentSchema.index({ group_id: 1 });
studentSchema.index({ group_id: 1, status: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ next_payment_date: 1 });
studentSchema.index({ full_name: 1 });

// Hash password before saving
studentSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
=======
// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Student', studentSchema);
