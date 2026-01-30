import mongoose from 'mongoose';

const arenaRoomSchema = new mongoose.Schema({
  room_code: {
    type: String,
    required: true,
    unique: true,
    length: 4
  },
  host_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  game_type: {
    type: String,
    enum: ['TYPING_SPEED'],
    default: 'TYPING_SPEED'
  },
  status: {
    type: String,
    enum: ['LOBBY', 'PLAYING', 'FINISHED'],
    default: 'LOBBY'
  },
  max_players: {
    type: Number,
    default: 7,
    min: 1,
    max: 7
  },
  current_stage: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  stage_words: {
    stage1: [String], // 1-2 letter words
    stage2: [String], // 3-4 letter words  
    stage3: [String]  // 5+ letter programming words
  },
  started_at: {
    type: Date
  },
  finished_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ArenaRoom', arenaRoomSchema);
