const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update user quiz results
router.post('/quiz-result', auth, async (req, res) => {
    const { score, totalQuestions, percentage, answers } = req.body;

    try {
        const user = await User.findById(req.user.id);
        user.attemptedQuizzes.push({
            score,
            totalQuestions,
            percentage,
            answers
        });

        await user.save();
        res.json({ msg: 'Quiz result saved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;