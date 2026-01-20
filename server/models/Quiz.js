import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    total_points: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        default: 15, // Default quiz duration
        min: 1
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'FINISHED'],
        default: 'DRAFT'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [{
        question_text: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correct_answer: {
            type: Number,
            required: true,
            min: 0,
            max: 3
        },
        points: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

quizSchema.pre('validate', function () {
    this.total_points = 100;

    if (!this.start_date || !this.end_date) return;
    const startDate = new Date(this.start_date);
    const endDate = new Date(this.end_date);
    if (endDate <= startDate) {
        this.invalidate('end_date', 'End date must be after start date');
    }
});

export default mongoose.model('Quiz', quizSchema);
