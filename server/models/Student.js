import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {      type: String,
    required: true,
    trim: true
  },
  parent_phone: {
    type: String,
    default: ''
  },
  profile_image: {
    type: String,
    default: '' // Profile rasmi (base64 yoki URL)
  },  }
}, {
  timestamps: true
});

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
  this.password = await bcrypt.hash(this.password, 10);});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Student', studentSchema);
