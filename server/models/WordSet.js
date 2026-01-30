import mongoose from 'mongoose';

const wordSetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['stage1', 'stage2', 'stage3']
  },
  words: [{
    word: { type: String, required: true },
    difficulty: { type: Number, min: 1, max: 10, default: 5 }
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Predefined word sets for programming
const defaultWordSets = [
  {
    category: 'stage1',
    words: [
      { word: 'if', difficulty: 1 },
      { word: 'is', difficulty: 1 },
      { word: 'in', difficulty: 1 },
      { word: 'it', difficulty: 1 },
      { word: 'of', difficulty: 1 },
      { word: 'on', difficulty: 1 },
      { word: 'or', difficulty: 1 },
      { word: 'to', difficulty: 1 },
      { word: 'do', difficulty: 1 },
      { word: 'go', difficulty: 1 },
      { word: 'be', difficulty: 1 },
      { word: 'by', difficulty: 1 },
      { word: 'my', difficulty: 1 },
      { word: 'up', difficulty: 1 },
      { word: 'as', difficulty: 1 },
      { word: 'at', difficulty: 1 },
      { word: 'so', difficulty: 1 },
      { word: 'we', difficulty: 1 },
      { word: 'he', difficulty: 1 },
      { word: 'id', difficulty: 1 }
    ]
  },
  {
    category: 'stage2', 
    words: [
      { word: 'code', difficulty: 3 },
      { word: 'data', difficulty: 3 },
      { word: 'loop', difficulty: 3 },
      { word: 'list', difficulty: 3 },
      { word: 'node', difficulty: 3 },
      { word: 'path', difficulty: 3 },
      { word: 'role', difficulty: 3 },
      { word: 'type', difficulty: 3 },
      { word: 'user', difficulty: 3 },
      { word: 'view', difficulty: 3 },
      { word: 'form', difficulty: 3 },
      { word: 'item', difficulty: 3 },
      { word: 'link', difficulty: 3 },
      { word: 'name', difficulty: 3 },
      { word: 'page', difficulty: 3 },
      { word: 'test', difficulty: 3 },
      { word: 'text', difficulty: 3 },
      { word: 'time', difficulty: 3 },
      { word: 'value', difficulty: 3 }
    ]
  },
  {
    category: 'stage3',
    words: [
      { word: 'function', difficulty: 5 },
      { word: 'variable', difficulty: 5 },
      { word: 'constant', difficulty: 5 },
      { word: 'interface', difficulty: 6 },
      { word: 'component', difficulty: 5 },
      { word: 'database', difficulty: 6 },
      { word: 'algorithm', difficulty: 7 },
      { word: 'structure', difficulty: 5 },
      { word: 'exception', difficulty: 6 },
      { word: 'iteration', difficulty: 6 },
      { word: 'recursion', difficulty: 7 },
      { word: 'polymorphism', difficulty: 8 },
      { word: 'encapsulation', difficulty: 8 },
      { word: 'inheritance', difficulty: 7 },
      { word: 'abstraction', difficulty: 7 },
      { word: 'asynchronous', difficulty: 8 },
      { word: 'synchronous', difficulty: 7 },
      { word: 'middleware', difficulty: 6 },
      { word: 'authentication', difficulty: 8 },
      { word: 'authorization', difficulty: 8 }
    ]
  }
];

// Initialize default word sets if empty
wordSetSchema.statics.initializeDefaults = async function() {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.insertMany(defaultWordSets);
    console.log('Default word sets initialized');
  }
};

export default mongoose.model('WordSet', wordSetSchema);
