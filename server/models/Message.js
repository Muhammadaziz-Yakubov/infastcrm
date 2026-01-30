import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  student_name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'emoji', 'image', 'file'],
    default: 'text'
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'moderator', 'vip'],
    default: 'student'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
  reply_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  reactions: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    emoji: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
messageSchema.index({ created_at: -1 });
messageSchema.index({ student_id: 1, created_at: -1 });
messageSchema.index({ is_deleted: 1 });

// Virtual for formatted time
messageSchema.virtual('formatted_time').get(function() {
  return this.created_at.toLocaleTimeString('uz-UZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

// Virtual for formatted date
messageSchema.virtual('formatted_date').get(function() {
  return this.created_at.toLocaleDateString('uz-UZ');
});

// Method to add reaction
messageSchema.methods.addReaction = function(studentId, emoji) {
  // Remove existing reaction from same student
  this.reactions = this.reactions.filter(
    reaction => reaction.student_id.toString() !== studentId.toString()
  );
  
  // Add new reaction
  this.reactions.push({
    student_id: studentId,
    emoji: emoji,
    created_at: new Date()
  });
  
  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(studentId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.student_id.toString() !== studentId.toString()
  );
  return this.save();
};

// Static method to get recent messages
messageSchema.statics.getRecentMessages = function(limit = 50) {
  return this.find({ is_deleted: false })
    .populate('student_id', 'full_name profile_image')
    .populate('reply_to', 'message student_name')
    .sort({ created_at: -1 })
    .limit(limit);
};

export default mongoose.model('Message', messageSchema);
