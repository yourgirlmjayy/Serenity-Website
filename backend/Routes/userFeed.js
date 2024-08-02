const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { calculateMoodFrequency } = require('../DataAnalysis/analysis.js');
const { calculateActivityFrequency } = require('../DataAnalysis/analysis.js');
const { analyzeUserData } = require('../DataAnalysis/analysis.js');

router.get('/user-feed', authenticateToken, async (req, res) => {
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
                },
                journals: true
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


router.get('/user-analytics', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // fetch the user's entries
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
            orderBy: { date: 'desc' }
        });
        // return empty objects of mood frequency and activity frequency if user does not have entries
        if (userEntries.length === 0) {
            return res.status(200).json({ moodFrequency: {}, activityFrequency: {} });
        }
        // get the analysis of the user's data
        const analyzedUserData = analyzeUserData(userEntries);
        // return the analyzed data
        res.status(200).json(analyzedUserData);
    } catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({ error: 'Failed to fetch user feed' })
    }
});




module.exports = router;