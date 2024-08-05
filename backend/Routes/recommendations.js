const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { generateRecommendations } = require('../Recommendations/GenerateRecommendations');
const { RecommendationMap } = require('../Recommendations/RecommendationMaps');

router.get('/recommendations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const currentDate = new Date();

        let recommendations = await prisma.recommendation.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                    lt: new Date(currentDate.setHours(23, 59, 59, 999)),
                },
            },
        });

        if (recommendations.length === 0) {
            recommendations = await generateRecommendations(userId, new Date());
        }
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

module.exports = router;
