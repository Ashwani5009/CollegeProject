const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Save user progress
router.post('/', auth, async (req, res) => {
    try {
        const { problemId, completed } = req.body;
        const userId = req.user._id;

        if (!problemId) {
            return res.status(400).json({ error: 'Problem ID is required' });
        }

        // Find existing progress for this user and problem
        let progress = await Progress.findOne({ userId, problemId });

        if (progress) {
            // Update existing progress
            progress.completed = completed;
            progress.updatedAt = new Date();
        } else {
            // Create new progress entry
            progress = new Progress({
                userId,
                problemId,
                completed
            });
        }

        await progress.save();

        // Get updated list of completed questions
        const completedProgress = await Progress.find({ userId, completed: true })
            .select('problemId')
            .lean();

        const completedQuestions = completedProgress.map(p => p.problemId.toString());

        res.status(200).json({ 
            message: 'Progress saved successfully',
            completedQuestions
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

// Get all progress for a user
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const progress = await Progress.find({ userId, completed: true })
            .select('problemId')
            .lean();
        
        // Extract completed problem IDs
        const completedQuestions = progress.map(p => p.problemId.toString());
        
        res.status(200).json({ 
            completedQuestions,
            totalCompleted: completedQuestions.length
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

module.exports = router; 