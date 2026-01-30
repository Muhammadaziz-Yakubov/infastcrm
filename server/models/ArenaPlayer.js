import mongoose from 'mongoose';

const arenaPlayerSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArenaRoom',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  socket_id: {
    type: String,
    required: true
  },
  is_host: {
    type: Boolean,
    default: false
  },
  current_stage: {
    type: Number,
    default: 0
  },
  stage_progress: {
    stage1: {
      words_completed: { type: Number, default: 0 },
      total_words: { type: Number, default: 0 },
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      completed_at: Date
    },
    stage2: {
      words_completed: { type: Number, default: 0 },
      total_words: { type: Number, default: 0 },
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      completed_at: Date
    },
    stage3: {
      words_completed: { type: Number, default: 0 },
      total_words: { type: Number, default: 0 },
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      completed_at: Date
    }
  },
  total_score: {
    type: Number,
    default: 0
  },
  final_rank: {
    type: Number
  },
  finished_at: {
    type: Date
  },
  joined_at: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique player per room
arenaPlayerSchema.index({ room_id: 1, student_id: 1 }, { unique: true });

export default mongoose.model('ArenaPlayer', arenaPlayerSchema);
