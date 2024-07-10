const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');

router.get('/user-feed', authenticateToken, async(req, res) => {
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
            orderBy: {date: 'desc'}
        });
        res.status(200).json(userEntries);
    } catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({error: 'Failed to fetch user feed'})
    }
});

module.exports = router;