const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const express = require('express');
const router = express.Router();

//Fetch user entries for the past week
const fetchUserEntries = async (userId) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const entries = await prisma.userEntry.findMany({
        where: {
            userId,
            date: {
                gte: oneWeekAgo,
            }
        },
        include: {
            moods: true,
            activities: {
                include: {
                    activityOption: true,
                },
            },
            journals: true,
        },
    });
    return entries;
};

// Fetch feedback data
const fetchFeedbackData = async (userId) => {
    try {
        const feedbackData = await prisma.journal.findMany({
            where: {
                userEntry: {
                    userId,
                }
            },
            select: {
                prompt: true,
                upvote: true,
                downvote: true
            }
        })
        const feedbackMap = feedbackData.reduce((accumulator, feedback) => {
            accumulator[feedback.prompt] = {
                upvotes: feedback.upvote,
                downvote: feedback.downvote
            };
            return accumulator;
        }, {});
        return feedbackMap;
    } catch (error) {
        console.error('Error fetching feedback data', error);
        throw new Error('Failed to fetch feedback data');
    }
}

//Fech prompt history for the user 
const fetchPromptHistory = async (userId) => {
    try {
        const promptHistoryData = await prisma.journal.findMany({
            where: {
                userEntry: {
                    userId,
                }
            },
            select: {
                prompt: true,
                content: true
            },
        });
        const promptHistory = promptHistoryData.reduce((accumulator, history) => {
            if (!accumulator[history.prompt]) {
                accumulator[history.prompt] = { views: 0, responses: 0 };
            }
            accumulator[history.prompt].views += 1;
            if (history.content) {
                accumulator[history.prompt].responses += 1;
            }
            return accumulator;
        }, {});

        return promptHistory;
    } catch (error) {
        throw new Error('Failed to fetch prompt History');
    }
}

module.exports = { fetchUserEntries, fetchFeedbackData, fetchPromptHistory };