import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  parent_phone: {
    type: String,
    default: ''
  },
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
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Student', studentSchema);
