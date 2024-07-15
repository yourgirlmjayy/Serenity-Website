const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');

router.get('/user-mood-activities', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const userEntries = await prisma.userEntry.findMany({
            where: { userId },
            include: {
                moods: true,
                activities: {
                    include: {
                        activityOption: true
                    }
                }
            },
            //return user's entries in descending order
            orderBy: { date: 'desc' }
        });
        res.status(200).json(userEntries);
    } catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({ error: 'Failed to fetch user feed' })
    }
});

router.post('/journal-entry', authenticateToken, async (req, res) => {
    const { mood, activities, content } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ error: `User ${userId} not found!` })
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        let userEntry = await prisma.userEntry.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                }
            },
            include: { journals: true }
        });

        if (!userEntry) {
            userEntry = await prisma.userEntry.create({
                data: {
                    userId,
                    date: new Date(),
                }
            })
        }
        const prompt = "test-prompt";
        const newJournal = await prisma.journal.create({
            data: {
                prompt,
                content,
                userEntryId: userEntry.id
            }
        });

        await prisma.userEntry.update({
            where: { id: userEntry.id },
            data: { journals: { connect: { id: newJournal.id } } }
        });

        res.status(201).json({ message: "Journal entry created successfully!, journal: newJournal" })
    } catch (error) {
        console.error('Falied to create journal entry', error);
        res.status(500).json({ error: "Failed to create journal entry" });
    }
})

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
            data: { content }
        });

        res.status(200).json({ message: "Journal updated successfully", journal: updatedJournal })
    } catch (error) {
        console.error("Error updating journal entry");
        res.status(500).json({ error: 'Failed to update journal entry' });

    }
})

module.exports = router;