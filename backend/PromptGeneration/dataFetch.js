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
        // Filter by user ID and date (entries from the last week)
        where: {
            userId,
            date: {
                gte: oneWeekAgo,
            }
        },
        // Include related data (moods, activities, journals)
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
    // Return the fetched entries
    return entries;
};

// Fetch feedback data
const fetchFeedbackData = async (userId) => {
    try {
        // Fetch feedback data from the database 
        const feedbackData = await prisma.journal.findMany({
            where: {
                userEntry: {
                    userId,
                }
            },
            // Select specific fields (prompt, upvote, downvote)
            select: {
                prompt: true,
                upvote: true,
                downvote: true
            }
        })
        // Create a feedback map (prompt -> upvotes/downvotes)
        const feedbackMap = feedbackData.reduce((accumulator, feedback) => {
            accumulator[feedback.prompt] = {
                upvotes: feedback.upvote,
                downvote: feedback.downvote
            };
            return accumulator;
        }, {});
        // Return the feedback map
        return feedbackMap;
    } catch (error) {
        console.error('Error fetching feedback data', error);
        throw new Error('Failed to fetch feedback data');
    }
}

//Fech prompt history for the user 
const fetchPromptHistory = async (userId) => {
    try {
        // Fetch prompt history data from the database
        const promptHistoryData = await prisma.journal.findMany({
            // Filter by user ID
            where: {
                userEntry: {
                    userId,
                }
            },
            // Select specific fields (prompt, content)
            select: {
                prompt: true,
                content: true
            },
        });
        // Create a prompt history map (prompt -> views/responses)
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
        // Return the prompt history map
        return promptHistory;
    } catch (error) {
        throw new Error('Failed to fetch prompt History');
    }
}

module.exports = { fetchUserEntries, fetchFeedbackData, fetchPromptHistory };