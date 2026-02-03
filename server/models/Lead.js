import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  lead_status: {
    type: String,
    enum: ['LEAD', 'INTERESTED', 'REGISTERED', 'CONFIRMED', 'CONVERTED', 'LOST'],
    default: 'LEAD'
  },
  source: {
    type: String,
    enum: ['Instagram', 'Telegram', 'Tanishlar', 'Reklama', 'Veb-sayt', 'Boshqa'],
    default: 'Boshqa'
  },
  course_interest: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  converted_to_student: {
    type: Date
  },
  follow_up_date: {
    type: Date
  },
  last_contact_date: {
    type: Date  }
}, {
  timestamps: true
});

export default mongoose.model('Lead', leadSchema);

