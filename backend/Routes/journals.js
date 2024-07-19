const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { analyzeUserData } = require('../DataAnalysis/analysis');
const { createInitialPrompt } = require('../PromptGeneration/journalPrompt');
const { fetchUserEntries, fetchFeedbackData, fetchPromptHistory } = require('../PromptGeneration/dataFetch');
const { generateJournalPromptWithGemini } = require('../utils/Gemini');


router.post('/generateJournalPrompt', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: `User ${userId} not found!` })
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // find user entry for today
        let userEntry = await prisma.userEntry.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                }
            },
        });

        // create user entry if none is found for that day
        if (!userEntry) {
            userEntry = await prisma.userEntry.create({
                data: {
                    userId,
                    date: today,
                }
            });
        }
        //fetch user data for the past week for analysis
        const entries = await fetchUserEntries(userId);
        const feedbackData = await fetchFeedbackData(userId);
        const promptHistory = await fetchPromptHistory(userId);

        const analysis = analyzeUserData(entries);
        const initialPrompt = createInitialPrompt(analysis, feedbackData, promptHistory);

        // use gemini ai to refine the prompt
        if (initialPrompt) {
            const refinedPrompt = await generateJournalPromptWithGemini(initialPrompt);

            // create a new journal entry with the refined prompt

            const newJournal = await prisma.journal.create({
                data: {
                    userEntryId: userEntry.id,
                    prompt: initialPrompt,
                    refinedPrompt: refinedPrompt
                }
            });

            await prisma.userEntry.update({
                where: { id: userEntry.id },
                data: { journals: { connect: { id: newJournal.id } } }
            });

            res.status(201).json({ message: 'Journal successfully created', journal: newJournal });
        } else {
            res.status(200).json({ message: 'No suitable prompt found based on feedback and history' })
        }
    } catch (error) {
        console.error('Falied to generate journal prompt', error);
        res.status(500).json({ error: "Failed to generate journal prompt" });
    }
});

router.post('/create-journal-entry', authenticateToken, async (req, res) => {
    const { userEntryId, content } = req.body;

    try {
        const newJournal = await prisma.journal.create({
            data: {
                userEntryId: userEntryId,
                content: content,
            }
        });
        res.status(201).json({ message: 'Journal entry successfully created!', journal: newJournal })
    } catch (error) {
        console.error('Error creating journal entry', error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }

});

router.patch('/update-journal-entry:id', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const journalId = parseInt(req.params.id);

    try {
        const journalEntry = await prisma.journal.findUnique({
            where: { id: journalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: { content: content }
        });

        res.status(200).json({ message: "Journal updated successfully", journal: updatedJournal })
    } catch (error) {
        console.error("Error updating journal entry");
        res.status(500).json({ error: 'Failed to update journal entry' });

    }
});

router.patch('/journal/vote', authenticateToken, async (req, res) => {
    const journalId = parseInt(req.params.journalId, 10);
    const { upvote, downvote } = req.body;

    try {
        const journalEntry = await prisma.journal.findUnique({
            where: { id: journalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: {
                upvote: { increment: upvote ? 1 : 0 },
                downvote: { increment: downvote ? 1 : 0 }
            }
        });

        res.status(200).json({ message: 'Journal vote updated successfully', journal: updatedJournal });

    } catch (error) {
        console.error('Error updating journal vote: error');
        res.status(500).json({ error: 'Failed to update journal vote' });
    }
});

router.patch('/journal/favorite', authenticateToken, async (req, res) => {
    const journalId = parseInt(req.params.journalId, 10);
    const { favorite } = req.body;

    try {
        const journalEntry = await prisma.journal.findUnique({
            where: { id: journalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: { favorite: favorite }
        });

        res.status(200).json({ message: 'Journal marked as favorite', journal: updatedJournal });
    } catch (error) {
        console.error('Error marking journal as favorite:', error);
        res.status(500).json({ error: 'Failed to mark journal as favourite' })
    }
})

module.exports = router;