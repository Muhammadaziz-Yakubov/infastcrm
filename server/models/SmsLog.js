import mongoose from 'mongoose';

const smsLogSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ['DEVSMS'],
    default: 'DEVSMS'
  },
  type: {
    type: String,
    default: ''
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  },
  provider_sms_id: {
    type: String,
    default: ''
  },
  provider_request_id: {
    type: String,
    default: ''
  },
  provider_status: {
    type: String,
    default: ''
  },
  provider_error: {
    type: String,
    default: ''
  },
  provider_response: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('SmsLog', smsLogSchema);
