import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE'],
    default: 'ABSENT'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  coins_awarded: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: '',
    maxlength: 500
  },
  check_in_time: {
    type: Date,
    default: null
  },
  lesson_topic: {
    type: String,
    default: '',
    maxlength: 200
  },
  homework_assigned: {
    type: String,
    default: '',
    maxlength: 500
  },
  behavior_rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  participation_level: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  },
  bonus_coins: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bonus_reason: {
    type: String,
    default: '',
    maxlength: 200
  }
}, {
  timestamps: true
});

attendanceSchema.index({ student_id: 1, group_id: 1, date: 1 }, { unique: true });
attendanceSchema.index({ group_id: 1, date: -1 });
attendanceSchema.index({ student_id: 1, date: -1 });

attendanceSchema.virtual('total_coins').get(function() {
  return this.coins_awarded + (this.bonus_coins || 0);
});

attendanceSchema.methods.calculateCoins = function() {
  let baseCoins = 0;
  
  switch(this.status) {
    case 'PRESENT':
      baseCoins = 50;
      break;
    case 'LATE':
      baseCoins = 25;
      break;
    case 'ABSENT':
      baseCoins = 0;
      break;
  }
  
  if (this.score >= 90) {
    baseCoins += 20;
  } else if (this.score >= 80) {
    baseCoins += 10;
  }
  
  if (this.behavior_rating >= 4) {
    baseCoins += 15;
  }
  
  if (this.participation_level === 'HIGH') {
    baseCoins += 10;
  }
  
  this.coins_awarded = baseCoins;
  return this.total_coins;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
