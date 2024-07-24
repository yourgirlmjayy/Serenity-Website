const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();

const authenticateToken = require('../MiddleWare/authenticateToken');
const { analyzeUserData } = require('../DataAnalysis/analysis');
const { generateJournalPromptWithFeedback } = require('../PromptGeneration/journalPrompt');
const { fetchUserEntries, fetchFeedbackData, fetchPromptHistory } = require('../PromptGeneration/dataFetch');


router.post('/generateJournalPrompt', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: `User ${userId} not found!` })
    }

    //get date without time
    const today = new Date();
    // set time of the day to be midnight
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
            include: {
                journals: true
            }
        });

        if (!userEntry) {
            userEntry = await prisma.userEntry.create({
                data: {
                    userId,
                    date: today,
                }
            });
        }

        // check if user entry has journals for that day
        if (userEntry && userEntry.journals && userEntry.journals.length > 0) {

            // get the most recent journal
            const journal = userEntry.journals[0];
            return res.status(200).json({ message: 'Journal already exists for today', initialPrompt: journal.initialPrompt, refinedPrompt: journal.refinedPrompt, journalId: journal.id, content: journal.content });
        }

        else {
            //fetch user data for the past week for analysis

            const entries = await fetchUserEntries(userId);

            const feedbackData = await fetchFeedbackData(userId);

            const promptHistory = await fetchPromptHistory(userId);

            const analysis = analyzeUserData(entries);

            // Generate a journal prompt using the analysis and other data
            const apiKey = process.env.GEMINI_API_KEY;

            // extract initial prompt and refined prompt from gemini
            const result = await generateJournalPromptWithFeedback(analysis, feedbackData, promptHistory, apiKey);
            const initialPrompt = result.initialPrompt;
            const refinedPrompt = result.refinedPrompt;

            // create a new journal entry with the refined prompt

            const newJournal = await prisma.journal.create({
                data: {
                    userEntryId: userEntry.id,
                    prompt: initialPrompt,
                    refinedPrompt: refinedPrompt,
                    content: ""
                }
            });

            // Link the new journal entry to the user entry
            await prisma.userEntry.update({
                where: { id: userEntry.id },
                data: { journals: { connect: { id: newJournal.id } } }
            });

            return res.status(201).json({ message: 'Journal successfully created', initialPrompt: initialPrompt, refinedPrompt: refinedPrompt, journalId: newJournal.id, content: newJournal.content });

        }

    } catch (error) {
        // Log any errors and return error response
        console.error('Failed to generate journal prompt', error);
        res.status(500).json({ error: "Failed to generate journal prompt" });
    }
});


router.patch('/create-journal-entry', authenticateToken, async (req, res) => {
    // get the content and userEntry from the request body
    const { journalId, content } = req.body;
    const parsedJournalId = parseInt(journalId, 10);

    try {
        const journalEntry = await prisma.journal.findUnique({
            // Find the journal entry by ID
            where: { id: parsedJournalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        // Update the journal entry with the new content
        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: { content: content }
        });

        // Return a success response with the updated journal entry
        res.status(200).json({ message: "Journal updated successfully", journal: updatedJournal })
    } catch (error) {
        console.error('Error creating journal entry', error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }

});

router.patch('/update-journal-entry', authenticateToken, async (req, res) => {
    // Get the content from the request body
    const { content } = req.body;
    const journalId = parseInt(req.body.journalId);

    try {
        const journalEntry = await prisma.journal.findUnique({
            // Find the journal entry by ID
            where: { id: journalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        // Update the journal entry with the new content
        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: { content: content }
        });

        // Return a success response with the updated journal entry
        res.status(200).json({ message: "Journal updated successfully", journal: updatedJournal })
    } catch (error) {
        console.error("Error updating journal entry");
        res.status(500).json({ error: 'Failed to update journal entry' });

    }
});

router.patch('/journal/vote', authenticateToken, async (req, res) => {
    const journalId = parseInt(req.body.journalId, 10);
    // Get the vote data from the request body
    const { upvote, downvote } = req.body;

    try {
        const journalEntry = await prisma.journal.findUnique({
            where: { id: journalId }
        });

        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found!' })
        }

        // Update the journal entry's vote count
        const updatedJournal = await prisma.journal.update({
            where: { id: journalId },
            data: {
                // Increment the downvote count or upvote count if either exists
                upvote: { increment: upvote >= 1 ? 1 : 0 },
                downvote: { increment: downvote >= 1 ? 1 : 0 }
            }
        });

        res.status(200).json({ message: 'Journal vote updated successfully', journal: updatedJournal });

    } catch (error) {
        console.error('Error updating journal vote: error');
        res.status(500).json({ error: 'Failed to update journal vote' });
    }
});

router.patch('/journal/favorite', authenticateToken, async (req, res) => {
    const journalId = parseInt(req.body.journalId, 10);
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
        res.status(500).json({ error: 'Failed to mark journal as favourite' });
    }
})

module.exports = router;