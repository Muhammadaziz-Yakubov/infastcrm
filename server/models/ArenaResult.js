import mongoose from 'mongoose';

const arenaResultSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArenaRoom'
  },
  game_type: {
    type: String,
    enum: ['TYPING_SPEED'],
    default: 'TYPING_SPEED'
  },
  total_score: {
    type: Number,
    required: true,
    default: 0
  },
  pts_earned: {
    type: Number,
    default: 0
  },
  stage_results: {
    stage1: {
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      time_seconds: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    stage2: {
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      time_seconds: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    },
    stage3: {
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      time_seconds: { type: Number, default: 0 },
      score: { type: Number, default: 0 }
    }
  },
  overall_wpm: {
    type: Number,
    default: 0
  },
  overall_accuracy: {
    type: Number,
    default: 0
  },
  total_time_seconds: {
    type: Number,
    default: 0
  },
  rank_in_game: {
    type: Number
  },
  players_count: {
    type: Number,
    default: 1
  },
  played_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ArenaResult', arenaResultSchema);
