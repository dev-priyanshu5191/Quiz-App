const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    attemptedQuizzes: [{
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        totalQuestions: Number,
        percentage: Number,
        attemptedAt: {
            type: Date,
            default: Date.now
        },
        answers: [{
            question: String,
            userAnswer: String,
            correctAnswer: String,
            isCorrect: Boolean
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);