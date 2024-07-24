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

// check if journal exists 
router.get('/journal/check/journal-entry', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    try {
        const userEntry = await prisma.userEntry.findFirst({
            where: {
                userId: userId,
                date: {
                    gte: today,
                    lt: tomorrow,
                }
            },
            include: {
                journals: true,
            }
        });

        // return true if journal has been created for today
        if (userEntry && userEntry.journals.length > 0) {
            return res.status(200).json({ exists: true, journal: userEntry.journals[0] })
        }
        // otherwise, return false
        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Error checking journal entry:', error)
        res.status(500).json({ error: 'An error occured when checking journal entry' });
    }
});


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
router.get('/journals/latest', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const latestJournalEntry = await prisma.userEntry.findFirst({
            where: {
                userId: userId,
            },
            orderBy: {
                date: 'desc'
            },
            include: {
                journals: true,
            }
        });

        if (!latestJournalEntry || latestJournalEntry.journals.length === 0) {
            return res.status(404).json({ error: 'Journal not found' });
        }

        const journal = latestJournalEntry.journals[0];

        res.status(200).json(journal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the journal' });
    }
});



module.exports = router;