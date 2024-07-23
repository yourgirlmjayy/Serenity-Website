const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../MiddleWare/authenticateToken');

// Helper function to get start and end of the day in user's local time
const getStartAndEndOfDay = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
};

// Fetch all journals for a user with sorting and filtering
router.get('/journals', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { sort = 'newest', filter = 'all' } = req.query;

    const sortOptions = {
        'A-Z': { refinedPrompt: 'asc' },
        'Z-A': { refinedPrompt: 'desc' },
        'newest': { id: 'desc' },
        'oldest': { id: 'asc' },
    };

    const filterOptions = {
        'all': {},
        'favorites': { favorite: true },
        'non-favorites': { favorite: false },
    };

    try {
        const journals = await prisma.journal.findMany({
            where: {
                userEntry: {
                    userId: userId,
                },
                ...filterOptions[filter],
            },
            orderBy: sortOptions[sort],
            select: {
                id: true,
                refinedPrompt: true,
                content: true,
                favorite: true,
                upvote: true,
                downvote: true
            },
        });

        res.status(200).json(journals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching journals' });
    }
});

// get the journal with its details
router.get('/journals/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const journalId = parseInt(req.params.id);

    try {
        const journal = await prisma.journal.findFirst({
            where: {
                id: journalId,
                userEntry: {
                    userId: userId
                }
            },
            select: {
                id: true,
                refinedPrompt: true,
                content: true,
                favorite: true,
                upvote: true,
                downvote: true,
                userEntry: {
                    select: {
                        userId: true,
                    }
                }
            },
        });

        if (!journal) {
            return res.status(404).json({ error: 'Journal not found' });
        }

        res.status(200).json(journal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the journal' });
    }
});

module.exports = router;