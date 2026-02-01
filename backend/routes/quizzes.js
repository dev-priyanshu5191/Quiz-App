const express = require('express');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create quiz (admin only)
router.post('/', async (req, res) => {
    const { title, category, difficulty, questions, totalQuestions } = req.body;

    try {
        const quiz = new Quiz({
            title,
            category,
            difficulty,
            questions,
            totalQuestions
        });

        await quiz.save();
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;