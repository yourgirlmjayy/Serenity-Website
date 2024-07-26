const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../MiddleWare/authenticateToken');
const { categorizeMood } = require('../DataAnalysis/analysis');
const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
// fetch the user's activities for the previous week
const fetchUserActivity = async (userId) => {
    try {
        const activities = await prisma.userEntry.findMany({
            where: {
                userId: userId,
                date: {
                    gte: date,
                },
            },
            orderBy: {
                date: 'desc',
            },
            include: {
                activities: {
                    include: {
                        activityOption: true
                    }
                }
            }
        });

        // edge case: user has no activities 
        if (!activities.length) {
            return [];
        }

        // process and categorize activities
        const processedActivities = activities.map(entry => ({
            date: entry.date,
            activities: entry.activities.map(activity => activity.activityOption.option),
        }));
        return processedActivities;
    } catch (error) {
        console.error('Error fetching user activities:', error);
        return [];
    }
};

const fetchUserMoods = async (userId) => {
    try {
        // fetch the user's past moods for last 7 days
        const moods = await prisma.userEntry.findMany({
            where: {
                userId: userId,
            },
            include: {
                moods: true
            },
            orderBy: {
                date: 'desc',
            }
        });
        if (!moods.length) {
            return [];
        }

        // process user's moods
        const processedMoods = moods.map(entry => ({
            date: entry.date,
            moods: entry.moods.map(mood => categorizeMood(mood)),
        }));
        return processedMoods;
    } catch (error) {
        console.error('Error fetching user moods:', error);
        return [];
    }
};

const fetchStoredLocation = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { latitude: true, longitude: true },
        });
        if (user && user.longitude && user.latitude) {
            return { latitude: user.latitude, longitude: user.longitude };
        }
        throw new Error('No stored location found')
    } catch (error) {
        console.error('Error fetching stored location:', error)
    }
}

module.exports = {
    fetchUserActivity,
    fetchUserMoods,
    fetchStoredLocation
}