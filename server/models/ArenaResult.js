import mongoose from 'mongoose';

const arenaResultSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  game_type: {
    type: String,
    enum: ['TYPING', 'QUIZ'],
    default: 'TYPING'
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  wpm: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  rank_in_game: {
    type: Number
  },
  played_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ArenaResult', arenaResultSchema);
