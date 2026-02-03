import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Faol O\'quvchi sertifikati'
  },
  description: {
    type: String,
    default: ''
  },
  certificate_image_url: {
    type: String,
    required: true // Canva'dan upload qilingan sertifikat rasmi
  },
  certificate_pdf_url: {
    type: String,
    default: '' // PDF formatidagi sertifikat (ixtiyoriy)
  },
  qr_code: {
    type: String,
    default: '' // QR code for verification (ixtiyoriy)
  },
  issued_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Admin user ID
  },
  issued_at: {
    type: Date,
    default: Date.now
  },
  telegram_sent: {
    type: Boolean,
    default: false
  },
  telegram_sent_at: {
    type: Date
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'REVOKED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// Index for efficient queries
certificateSchema.index({ student_id: 1, issued_at: -1 });
certificateSchema.index({ group_id: 1 });

export default mongoose.model('Certificate', certificateSchema);
